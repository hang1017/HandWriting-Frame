import path from "path";
import { existsSync } from "fs";
import { build } from "esbuild";
import type { Server } from "http";
import { DEFAULT_CONFIG_FILE } from "./constants";
import type { AppDataProps } from "./appData";

export interface UserConfigProps {
  title?: string;
  keepalive?: any[];
}

export const getUserConfig = ({ appData, malitaServe }: { appData: AppDataProps; malitaServe: Server }) => {
  return new Promise(async (resolve: (value: UserConfigProps) => void, rejects) => {
    let config = {};
    const configFile = path.resolve(appData.paths.cwd, DEFAULT_CONFIG_FILE);
    if (existsSync(configFile)) {
      config = require(configFile);
      await build({
        bundle: true,
        format: "cjs",
        logLevel: "error",
        outdir: appData.paths.absOutputPath,
        watch: {
          onRebuild: (err) => {
            if (err) {
              console.error(JSON.stringify(err));
              return;
            }
            malitaServe.emit("REBUILD", { appData });
          },
        },
        define: {
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        external: ["esbuild"],
        entryPoints: [configFile],
      });
      try {
        const filePath = path.resolve(appData.paths.absOutputPath, "malita.config.js");
        delete require.cache[filePath];
        config = require(filePath);
      } catch (error) {
        console.error("getUserConfig error", error);
        rejects(error);
      }
    }
    resolve(config);
  });
};
