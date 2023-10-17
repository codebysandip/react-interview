import { writeFile } from "fs";
/**
 * MetaInfoPlugin gets hash of main js and css file and
 * saves as json into specified path.
 * Later project can use hash to serve main js and css file
 */
export default class MetaInfoPlugin {
  constructor(options) {
    this.options = { path: "meta.json", ...options };
    this.metaInfo = {};
  }

  apply(compiler) {
    compiler.hooks.assetEmitted.tap(
      this.constructor.name,
      (file) => {
        if (file.match(/.*(?<!br|gz)$/)) {
          const splitted = file.split(".");
          const pathParts = splitted[0].split("/");
          const ext = splitted[splitted.length - 1];
          this.metaInfo[`${pathParts[pathParts.length - 1]}.${ext}`] = "/" + file;
        }
      },
    );

    compiler.hooks.done.tap(this.constructor.name, () => {
      const json = JSON.stringify(this.metaInfo);
      return new Promise((resolve, reject) => {
        writeFile(this.options.path, json, "utf8", (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    });
  }
}
