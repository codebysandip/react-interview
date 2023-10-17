import bodyParser from "body-parser";
import express from "express";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { URL_REFRESH_TOKEN } from "../src/const";
import { loginApi, refreshTokenApi, validateTokenMiddleware } from "./auth-api";
import { etagMiddleware } from "./etag.middleware";

const ProductsData = JSON.parse(
  readFileSync(join(process.cwd(), "mocks/api/product.json"), { encoding: "utf-8" }),
);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  setTimeout(() => {
    next();
  }, 50);
});
app.use(etagMiddleware);

// this should be first route always
// this route will try to get json from mocks folder otherwise will send request to other routes
app.get("/*", (req, res, next) => {
  const sendResponse = () => {
    const data = JSON.parse(readFileSync(jsonPath, { encoding: "utf-8" }));
    res.json(data);
  };
  const jsonPath = join(process.cwd(), "mocks", `${req.path.substring(1)}.json`);
  if (existsSync(jsonPath)) {
    const token = req.headers.authorization;
    if (token) {
      validateTokenMiddleware(req, res, () => {
        sendResponse();
      });
    }
    sendResponse();
  } else {
    next();
  }
});

app.post("/api/login", loginApi);

app.post(URL_REFRESH_TOKEN, refreshTokenApi);

app.get("/api/product/:id", validateTokenMiddleware, (req, res) => {
  const product = ProductsData.products.find((p: any) => p.id === parseInt(req.params.id));
  res.status(product ? 200 : 204).json(product || {});
});

const PORT = process.env.TEST_API_PORT || 3002;
app.listen(PORT, () => console.log(`Test Api listening on port ${PORT}`));
