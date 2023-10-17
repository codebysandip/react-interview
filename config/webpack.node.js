import Dotenv from "dotenv-webpack";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import { getDefinePluginObjFromEnv } from "./functions/get-define-plugin-obj-from-env.js";
import { getPath, isLocalFn } from "./functions/helper-functions.js";
import { tsconfigPathToWebpackPath } from "./functions/tsconfig-path-to-webpack-path.js";

export default function (env, args) {
  /** Is Build running for local development */
  const isLocal = isLocalFn(env);
  const isDev = env.ENV === "development";
  const isCypress = env.ENV === "cypress";

  const definePluginObj = getDefinePluginObjFromEnv(env);
  const alias = tsconfigPathToWebpackPath();

  const config = {
    target: "node",
    mode: "development",
    entry: {
      server: "./src/node/index.ts",
    },
    output: {
      filename: "server.mjs",
      path: getPath("build"),
      chunkFilename: "[name].chunk.js",
      chunkFormat: "module",
    },
    experiments: {
      topLevelAwait: true,
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "swc-loader",
              options: {
                parseMap: false,
                jsc: {
                  parser: {
                    syntax: "typescript",
                    dynamicImports: true,
                  },
                },
                isModule: true,
                sourceMaps: isLocal,
                inlineSourcesContent: isLocal,
                module: {
                  type: "es6",
                  lazy: true,
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias,
      extensions: [".ts", ".js"],
    },
    externals: [
      nodeExternals({
        importType: function (moduleName) {
          return moduleName;
        },
      }),
    ],
    plugins: [
      new webpack.DefinePlugin(definePluginObj),
      new Dotenv({
        path: getPath(`./env/${env.ENV}.env`),
      }),  
    ],
    externalsPresets: { node: true },
  };
  return config;
}
