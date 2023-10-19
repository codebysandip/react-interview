import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import { createRequire } from "module";
import { join } from "path";
import webpack from "webpack";
import WebpackDevMiddleware from "webpack-dev-middleware";
import WebpackHotMiddleware from "webpack-hot-middleware";
import webpackDevConfig from "../config/webpack.dev";
import webpackProdConfig from "../config/webpack.prod";
import { proxyMiddleware } from "../src/node/middlewares/proxy-middleware";
import { startNodeServer } from "../src/node/server";
import { log } from "./logger";

const require = createRequire(import.meta.url);
const env = process.env.ENV;
require("dotenv").config({ path: join(process.cwd(), `env/${env}.env`) });
log(`environment: ${env}`);

// load es module after load of dotenv to bind constants with process env
let mod: any = {};
(async function fetchMod() {
  mod = await import("../src/const");
})();

let webpackConfig: any;

const baseEnv = { IS_LOCAL: "true", ENV: env };
const isDev = env === "development" || env === "cypress";
// webpack client build
if (isDev) {
  webpackConfig = webpackDevConfig(baseEnv, {});
} else {
  webpackConfig = webpackProdConfig(baseEnv, {});
}
const compiler = webpack(webpackConfig);

const middlewares = [];
// start webpack dev server for HMR
middlewares.push(
  WebpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: false,
    writeToDisk: true, // assign true only if need to check on local that build publishing file or not but performance will decrease
  }),
);

middlewares.push(WebpackHotMiddleware(compiler, {}));

const API_BASE_URL = mod.API_BASE_URL;
/* istanbul ignore if */
if (API_BASE_URL) {
  throw new Error(
    `Please add env/${process.env.ENV}.env file if not available. Add API_BASE_URL in .env file`,
  );
}
console.log(chalk.yellowBright("/api/* request will proxy to ", API_BASE_URL));

middlewares.push((req: Request, resp: Response, next: NextFunction) => {
  if (req.url.startsWith("/api/")) {
    proxyMiddleware(API_BASE_URL || "")(req, resp, next);
    return;
  }
  next();
});

const app = startNodeServer(middlewares);

if (process.env.IS_LOCAL) {
  const LOCAL_API_SERVER = mod.LOCAL_API_SERVER;
  // Following code is just for reference
  // If api is not available and you want to return dummy response
  // create a test api in test-api.ts and add here
  // Don't forget to remove proxy otherwise response will always come from test api
  app.get("/api/products", proxyMiddleware(LOCAL_API_SERVER));
}
