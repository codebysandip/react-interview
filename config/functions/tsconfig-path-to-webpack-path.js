import { readFileSync } from "fs";
import { join } from "path";
import { getPath } from "./helper-functions.js";

/**
 * Function to convert tsconfig path to webpack alias path
 *
 * @param {any} tsconfigPath Path of tsconfig
 * @returns Alias object
 */
export function tsconfigPathToWebpackPath(tsconfigPath = "tsconfig.json") {
  const tsconfigJson = JSON.parse(
    readFileSync(join(process.cwd(), tsconfigPath), { encoding: "utf-8" }),
  );

  const alias = {};
  const aliasPaths = tsconfigJson.compilerOptions.paths;
  Object.keys(aliasPaths).forEach((key) => {
    const aliasKey = key.replace("/*", "");
    alias[aliasKey] = getPath(aliasPaths[key][0].replace("/*", ""));
  });
  return alias;
}
