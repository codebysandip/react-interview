const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  fg: {
    Red: "\x1b[31m",
    Yellow: "\x1b[33m",
    Green: "\x1b[32m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
  },
};
const printMsg = function (msg: string[], color: string, newline = false, padding = 0) {
  process.stdout.write("  ");
  if (padding) process.stdout.write(" ".repeat(padding));
  process.stdout.write(color);
  process.stdout.write(colors.Bright);
  process.stdout.write("" + msg.join(""));
  process.stdout.write(colors.Reset);
  if (newline) console.log();
};

export const log = function (...msg: any[]) {
  return printMsg(msg, colors.fg.Green, true);
};
export const warn = function (...msg: string[]) {
  return printMsg(msg, colors.fg.Yellow, true);
};
export const error = function (...msg: string[]) {
  return printMsg(msg, colors.fg.Red, true);
};
export const cyan = function (...msg: string[]) {
  return printMsg(msg, colors.fg.Cyan, true);
};
