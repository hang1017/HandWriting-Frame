import { AppDataProps } from "./appData";
import path from "path";
import { build } from "esbuild";
import { Server } from "http";
import { Options } from "http-proxy-middleware";
import { DEFAULT_CONFIG_FILE, DEFAULT_PLATFORM } from "./constants";

export interface UserConfigProps {
  title?: string;
  keepalive?: (string | RegExp)[];
  proxy: Options[];
}

export const getUserConfig = async ({
  appData,
  malitaServer,
  isProduction = false,
}: {
  appData: AppDataProps;
  malitaServer?: Server;
  isProduction: boolean;
}) => {
  return new Promise(async (resolve: (res: UserConfigProps) => void) => {
    let config = {} as UserConfigProps;
    const configPath = path.resolve(appData.paths.cwd, DEFAULT_CONFIG_FILE);
    await build({
      bundle: true,
      platform: DEFAULT_PLATFORM,
      logLevel: "error",
      format: "cjs",
      outdir: appData.paths.absOutputPath,
      watch: isProduction
        ? false
        : {
            onRebuild: (err, res) => {
              if (err) {
                console.log(res);
                return;
              }
              console.log("malitaServer: REBUILD");
              if (malitaServer) malitaServer.emit("REBUILD", { appData });
            },
          },
      external: ["esbuild"],
      entryPoints: [configPath],
    });

    try {
      const cfile = path.resolve(appData.paths.absOutputPath, "malita.config.js");
      delete require.cache[cfile];
      config = require(cfile).default;
      resolve(config);
    } catch (e) {}
  });
};
