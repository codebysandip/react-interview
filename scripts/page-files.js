import chalk from "chalk";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd, exit } from "process";

const args = process.argv.slice(2);
const pagePaths = args[0].split("/");
const pageName = pagePaths[pagePaths.length - 1];
const folderPath = join(cwd(), "src/pages", args[0]);

if (!existsSync(folderPath)) {
  mkdirSync(folderPath, { recursive: true });
}

const createFile = (type, ext = "ts") => {
  const filepath = join(folderPath, `${pageName}.${type}${ext ? "." + ext : ""}`);
  if (existsSync(filepath)) {
    console.log(chalk.red(`${filepath} already exist`));
    exit(1);
  }
  writeFileSync(filepath, "", { encoding: "utf-8" });
};

createFile("page", "tsx");
createFile("redux");
createFile("model");
createFile("scss", "");
