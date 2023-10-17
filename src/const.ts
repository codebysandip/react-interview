/* ####### Local storage keys ####### */
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const LS_USERNAME = "username";
export const LS_PASSWORD = "password";
export const LS_IS_LOGGED_IN = "isLoggedIn";

/* ##### API URLS ##### */
export const URL_REFRESH_TOKEN = "/api/refresh-token";

/* ##### Page URLS ##### */
export const ROUTE_HOME = "/";
export const ROUTE_404 = "/404";
export const ROUTE_500 = "/500";
export const ROUTE_LOGIN = "/login";
export const ROUTE_403 = "/403";
export const ROUTE_PROFILE = "/profile/:id";

export const NO_HEADER_PATHS = [
  // don't show header or footer in case of error page
  // error can happen in header/footer api
  ROUTE_404,
  ROUTE_500,
  ROUTE_403,
];

/* ##### ERROR MESSAGES ##### */
export const PAGE_INVALID_RETURN_DATA = `
Page component should return IRedirect or ApiResponse object!!
Reason: Api server can return other status than 200 in that case
User should redirect to appropriate page base on status of api
`;
export const INTERNET_NOT_AVAILABLE =
  "Please check your network connection. Internet not available";

/* ##### Events ##### */
export const TOAST = "toast";

/* ##### Regex ##### */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

/* ##### Other ##### */
export const IS_DEV = process.env.ENV === "development";
export const TEST_API_PORT = process.env.TEST_API_PORT || 3002;
export const LOCAL_API_SERVER = `http://localhost:${TEST_API_PORT}`;

export const API_URL =
  process.env.ENV === "cypress" || process.env.LOCAL_API_SERVER === "true"
    ? LOCAL_API_SERVER
    : process.env.API_BASE_URL;
export const IS_CYPRESS = process.env.ENV === "cypress";

export const PUBLIC_FOLDER = "build/public";
