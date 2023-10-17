import { matchPath } from "react-router";
import { Routes } from "src/routes";

/**
 * Match route from {@link Routes} for given path
 * @param path path to be matched
 * @returns {@link IRoute}
 */
export function getRoute(path: string) {
  const route = Routes.find((r) => matchPath(r.path, path));
  return route;
}
