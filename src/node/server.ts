import express from "express";
import { join } from "path";

import bodyParser from "body-parser";
import helmet from "helmet";
import { PUBLIC_FOLDER } from "../const";
import { StaticRoute } from "./middlewares/static-files.middleware";

/**
 * Exported this function from here because we are using the same in scripts/build.ts\
 * For local development server also
 */
export function startNodeServer(middlewares: any[] = []) {
  // page components can use metaJson to load page css on before loading of client Js
  // this will enable fix the issue of CLS. Without css page will render without styling

  const app = express();

  middlewares.forEach((middleware) => {
    app.use(middleware);
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get("*.(css|js|svg|jpg|jpeg|png|woff|woff2)", StaticRoute);

  // Tell express for public folder
  app.use(express.static(join(process.cwd(), PUBLIC_FOLDER)));

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": "'self' 'unsafe-inline' 'unsafe-eval'",
          "img-src": "'self' data: https://fakestoreapi.com",
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  // Serve index.html for all request
  app.get("/*", (_, res) => {
    res.sendFile(join(process.cwd(), PUBLIC_FOLDER, "index.html"));
  });
  const PORT = parseInt(process.env.PORT || "5200");

  const startServer = () => {
    app.listen(PORT, () => {
      console.log(`App listening on port: ${PORT}`);
    });
  };
  startServer();
  return app;
}
