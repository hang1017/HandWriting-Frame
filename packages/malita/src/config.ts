import type { AppDataProps } from "./appData";
import path from "path";
import { Server } from "http";
import { existsSync } from "fs-extra";
import { build } from "esbuild";
import { DEFAULT_CONFIG_FILE } from "./contants";
import { ProxyProps } from "./proxy";

export interface ConfigProps {
  title?: string;
  keepalive?: (string | RegExp)[];
  proxy?: ProxyProps;
}

export const getConfig = async ({
  appData,
  malitaServer,
}: {
  appData: AppDataProps;
  malitaServer: Server;
}) => {
  return new Promise(async (resolve: (res: ConfigProps) => void, reject) => {
    let config = {};
    try {
      const configPath = path.join(appData.paths.cwd, DEFAULT_CONFIG_FILE);
      const outFilePath = path.join(appData.paths.absTempPath, "malita.config.js");
      await build({
        bundle: true,
        charset: "utf8",
        external: ["esbuild"],
        format: "cjs",
        platform: "node",
        logLevel: "error",
        entryPoints: [configPath],
        outfile: outFilePath,
        define: {
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        watch: {
          onRebuild: (err) => {
            if (err) {
              console.log(err);
              return;
            }
            malitaServer.emit("REBUILD", { appData });
          },
        },
      });
      if (existsSync(outFilePath)) {
        delete require.cache[outFilePath];
        config = require(outFilePath).default;
      }
      resolve(config);
    } catch (e) {
      reject(config);
    }
  });
};
