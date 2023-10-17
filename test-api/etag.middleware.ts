import { NextFunction, Request, Response } from "express";
import etag from "etag";

/**
* override json and send methods of Response  
* add etag header
*/
export function etagMiddleware(req: Request, res: Response, next: NextFunction) {
  const send = res.send;
  const json = res.json;
  res.send = function (body) {
    return send.call(this, body);
  };
  res.json = function (body) {
    const etagVal = etag(JSON.stringify(body), { weak: true });
    this.setHeader("etag", etagVal);
    // uncomment below code when frontend using caching based on etag
    // if (req.headers.etag && req.headers.etag === etagVal) {
    //   console.log("etag!!", req.headers.etag, etagVal);
    //   return json.call(this, {});
    // } else {
    //   return json.call(this, body);
    // }
    return json.call(this, body);
  };

  next();
}