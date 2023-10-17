/* istanbul ignore file */
import { NextFunction, Request, Response } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { IS_CYPRESS, IS_DEV, PUBLIC_FOLDER } from "../../const";

/**
 * This function alters request url for static files and adds .br/.gz at the end
 * based on accept encoding header of request
 * @param req Request
 * @param resp Response
 * @returns void
 */
function changeUrlBasedOnEncoding(req: Request, resp: Response) {
  const encoding = req.headers["accept-encoding"];
  if (req.url.indexOf(".js") !== -1) {
    resp.set("Content-Type", "application/javascript");
  } else if (req.url.indexOf(".css") !== -1) {
    resp.set("Content-Type", "text/css");
  } else if (req.url.indexOf(".svg") !== -1) {
    resp.set("Content-Type", "image/svg+xml");
  } else if (req.url.indexOf(".jpg") !== -1) {
    resp.set("Content-Type", "image/jpeg");
  } else if (req.url.indexOf(".woff") !== -1) {
    resp.set("Content-Type", "font/woff");
  } else if (req.url.indexOf(".woff2") !== -1) {
    resp.set("Content-Type", "font/woff2");
  }

  // in case of service work file, only serve the exact file
  if (req.url.indexOf("service-worker.js") !== -1 || req.url.match(/(workbox.+)\.js/)) {
    return;
  }
  // 180 Days for caching static files
  resp.set("Cache-Control", "public, max-age=15552000");

  if (encoding?.indexOf("br") !== -1) {
    req.url += ".br";
    resp.set("Content-Encoding", "br");
  } else if (encoding?.indexOf("gzip") !== -1) {
    req.url += ".gz";
    resp.set("Content-Encoding", "gzip");
  }
}

/**
 * Middleware to server static files like js,css and other static files
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns it's a middleware so it will not return anything from function
 */
export function StaticRoute(req: Request, res: Response, next: NextFunction) {
  // send 404 status code when file not available
  if (!existsSync(join(process.cwd(), PUBLIC_FOLDER, req.path))) {
    res.status(404).send();
    return;
  }

  // in case of local development or for cypress serve non compressed files
  // also checking here if compressed file exist otherwise express static will serve the file
  if (
    !(IS_DEV || IS_CYPRESS) &&
    existsSync(join(process.cwd(), PUBLIC_FOLDER, `${req.path}.gz`))
  ) {
    changeUrlBasedOnEncoding(req, res);
  }
  next();
}
