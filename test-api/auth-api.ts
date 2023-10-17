import { TokenData } from "examples/auth/auth.model";
import { NextFunction, Request, Response } from "express";
import { readFileSync } from "fs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { join } from "path";

const UsersData = JSON.parse(
  readFileSync(join(process.cwd(), "mocks/api/user.json"), { encoding: "utf-8" }),
);

const secretKey = "react-ssr";
const accessTokenExpTime = "5m";
const refreshTokenExpTime = "7m";

export function loginApi(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = UsersData.users.find((u: any) => u.email === email);
  if (!user) {
    res.status(400).json({
      message: "User not found!!",
    });
  } else if (user.password !== password) {
    res.status(400).json({
      message: "Password is not valid",
    });
  } else {
    const token = jwt.sign(user, secretKey, {
      expiresIn: accessTokenExpTime,
    });
    const refreshToken = jwt.sign(user, secretKey, {
      expiresIn: refreshTokenExpTime,
    });
    res.json({
      accessToken: token,
      refreshToken,
    });
  }
}

export function refreshTokenApi(req: Request, res: Response) {
  try {
    const decoded = jwt.verify(req.body.refreshToken, secretKey) as TokenData;
    delete decoded.iat;
    delete decoded.exp;
    const token = jwt.sign(decoded, secretKey, {
      expiresIn: accessTokenExpTime,
    });
    const refreshToken = jwt.sign(decoded, secretKey, {
      expiresIn: refreshTokenExpTime,
    });
    res.json({
      accessToken: token,
      refreshToken,
    });
  } catch (err: any) {
    console.log("Error in jwt verify!!!", err);
    res.status(500).json({
      message: err.message,
    });
  }
}

const validateToken = (token?: string): { message: string } | JwtPayload => {
  if (!token) {
    return {
      message: "Token is not available in request header",
    };
  } else if (!token.startsWith("Bearer ")) {
    return {
      message: "Token should be a Bearer token",
    };
  }
  token = token.split("Bearer ")[1];
  try {
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
    return decoded;
  } catch (error) {
    return {
      message: (error as Error).message,
    };
  }
};

export const validateTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const validationResult = validateToken(token);
  if (validationResult.message) {
    res.status(401).json(validationResult);
  } else {
    res.locals.user = validationResult;
    next();
  }
};
