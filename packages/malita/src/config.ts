import { AppDataProps } from "./appData";
import path from "path";
import { build } from "esbuild";
import { DEFAULT_CONFIG_FILE, DEFAULT_PLATFORM } from "./constants";

export interface UserConfigProps {
  title?: string;
  keepalive?: (string | RegExp)[];
}

export const getUserConfig = async ({
  appData,
  sendMessage,
}: {
  appData: AppDataProps;
  sendMessage: (type: string, data?: any) => void;
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
      watch: {
        onRebuild: (err, res) => {
          if (err) {
            console.log(res);
            return;
          }
          sendMessage("reload");
        },
      },
      external: ["esbuild"],
      entryPoints: [configPath],
    });

    try {
      config = require(path.resolve(appData.paths.absOutputPath, "malita.config.js")).default;
      resolve(config);
    } catch (e) {}
  });
};
