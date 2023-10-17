import chalk from "chalk";
import { Request, Response } from "express";
import proxy from "express-http-proxy";

const isMultipartRequest = function (req: Request) {
  const contentTypeHeader = req.headers["content-type"];
  return contentTypeHeader && contentTypeHeader.indexOf("multipart") > -1;
};

/**
 * Proxy request middleware
 *
 * @param proxyUrl Url to proxy request
 * @returns
 */
export const proxyMiddleware = function (proxyUrl: string) {
  return function (req: Request, res: Response, next: () => void) {
    if (process.env.ENV !== "cypress") {
      console.log(chalk.green(`Request ${req.url} proxy to ${proxyUrl}`));
    }

    let reqAsBuffer = false;
    let reqBodyEncoding: string | null = "utf-8";
    // eslint-disable-next-line prefer-const
    let parseReqBody = true;
    /* istanbul ignore if */
    if (isMultipartRequest(req)) {
      reqAsBuffer = true;
      reqBodyEncoding = null;
      parseReqBody = false;
    }
    return proxy(proxyUrl, {
      reqAsBuffer,
      reqBodyEncoding,
      parseReqBody,
      proxyReqOptDecorator: (proxyReqOpts) => {
        return proxyReqOpts;
      },

      proxyErrorHandler: /* istanbul ignore next */ (err, res) => {
        // change response as per need
        // this should match the error response of API
        console.error(chalk.red(`Error in proxy request. Url:${req.url}!!`, err));
        res.status(500).send({
          message: "Something went wrong!!",
        });
      },
    })(req, res, next);
  };
};
