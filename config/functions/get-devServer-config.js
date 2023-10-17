import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function getDevServerConfig(env) {
  let proxy = {};
  if (env.proxy) {
    const proxyConfigPath = join(process.cwd(), env.proxy);
    if (existsSync(proxyConfigPath)) {
      const str = readFileSync(proxyConfigPath, "utf-8");
      proxy = JSON.parse(str);
    }
  }
  return {
    static: {
      directory: join(process.cwd(), 'build/public'),
    },
    compress: false,
    historyApiFallback: true,
    hot: true,
    port: 5200,
    proxy
  };
}
