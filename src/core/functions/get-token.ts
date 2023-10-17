import { JwtToken, TokenData } from "examples/auth/auth.model";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "src/const";

function getToken(key: string) {
  const accessToken = localStorage.getItem(key);
  if (!accessToken) {
    return null;
  }
  const tokenData = decodeToken<JwtToken>(accessToken);
  if (isValidJwtToken(tokenData)) {
    return {
      token: accessToken,
      tokenData,
    };
  }
  return null;
}
/**
 * get access token
 * @param req Node Request Object
 * @returns access token
 */
export function getAccessToken() {
  const tokenWithData = getToken(ACCESS_TOKEN);
  if (!tokenWithData) {
    return null;
  }
  return tokenWithData.token;
}

/**
 * decode JWT token
 * @param token JWT token
 * @returns decoded token of type T
 */
export function decodeToken<T>(token: string) {
  try {
    let tokenStr = "";
    if (process.env.IS_SERVER) {
      tokenStr = Buffer.from(token.split(".")[1], "base64").toString();
    } else {
      tokenStr = atob(token.split(".")[1]);
    }
    return JSON.parse(tokenStr) as T;
  } catch {
    throw new Error("Invalid Jwt token");
  }
}

export function isValidJwtToken(tokenData: JwtToken) {
  if ((tokenData.exp || 1) * 1000 > Date.now()) {
    return tokenData;
  }
  return null;
}
/**
 * get access token data
 * @param req Node Request Object
 * @returns decoded token of type T
 */
export function getAccessTokenData() {
  const tokenWithData = getToken(ACCESS_TOKEN);
  if (!tokenWithData) {
    return null;
  }
  return tokenWithData.tokenData as TokenData;
}

/**
 * get refresh token
 * @returns refresh token
 */
export function getRefreshToken() {
  const tokenWithData = getToken(REFRESH_TOKEN);
  if (!tokenWithData) {
    return null;
  }
  return tokenWithData.token;
}

