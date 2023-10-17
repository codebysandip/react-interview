import chalk from "chalk";
import { spawnSync } from "child_process";
import { program } from "commander";

program.option("-e, --env <string...>", "Environment", "development");

program.parse();

const options = program.opts();

console.log(chalk.yellowBright("Build react app in production build mode!!"));
console.log();
spawnSync(
  // eslint-disable-next-line max-len
  `npx webpack --config ./config/webpack.prod.js --env ${options.env.join(" --env ")}`,
  {
    shell: true,
    stdio: "inherit",
  },
);

console.log(chalk.yellowBright("Build node sering app!!"));
console.log();

spawnSync(
  // eslint-disable-next-line max-len
  `npx webpack --config ./config/webpack.node.js --env ${options.env.join(" --env ")}`,
  {
    shell: true,
    stdio: "inherit",
  },
);
