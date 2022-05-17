import type { Server } from "http";
import { build } from "esbuild";
import path from "path";
import { glob } from "glob";
import type { AppDataProps } from "./appData";

function cleanRequireCache(absMockPath: string) {
  Object.keys(require.cache).forEach((file) => {
    if (file.indexOf(absMockPath) !== -1) delete require.cache[file];
  });
}

function normalizeConfig(config: any) {
  return Object.keys(config).reduce((memo: any, key) => {
    const handler = config[key];
    const type = typeof handler;
    if (type !== "function" && type !== "object") return memo;
    const req = key.split(" ");
    const method = req[0];
    const url = req[1];
    if (!memo[method]) memo[method] = {};
    memo[method][url] = handler;
    return memo;
  }, {});
}

export const getMockConfig = ({ appData, malitaServe }: { appData: AppDataProps; malitaServe: Server }) => {
  return new Promise(async (resolve: (value: any) => void, rejects) => {
    let config = {};
    const mockDir = path.resolve(appData.paths.cwd, "mock");
    const mockFiles = glob.sync("**/*.ts", { cwd: mockDir });
    const ret = mockFiles.map((item) => path.join(mockDir, item));
    const mockOutDir = path.resolve(appData.paths.absTmpPath, "mock");
    await build({
      bundle: true,
      format: "cjs",
      logLevel: "error",
      outdir: mockOutDir,
      watch: {
        onRebuild: (err) => {
          if (err) {
            console.error(JSON.stringify(err));
            return;
          }
          malitaServe.emit("REBUILD", { appData });
        },
      },
      external: ["esbuild"],
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      entryPoints: ret,
    });
    try {
      const outMockFiles = glob.sync("**/*.js", {
        cwd: mockOutDir,
      });
      cleanRequireCache(mockOutDir);
      config = outMockFiles.reduce((memo, mockFile) => {
        memo = {
          ...memo,
          ...require(path.resolve(mockOutDir, mockFile)).default,
        };
        return memo;
      }, {});
    } catch (e) {
      rejects(e);
    }
    resolve(normalizeConfig(config));
  });
};
