import { AppDataProps } from "./appData";
import { Server } from "http";
import { build } from "esbuild";
import path from "path";
import glob from "glob";
import { DEFAULT_PLATFORM } from "./constants";

const cleanRequireCache = (absMockPath: string) => {
  Object.keys(require.cache).forEach((file) => {
    if (file.indexOf(absMockPath) !== -1) {
      delete require.cache[file];
    }
  });
};

const normalizeConfig = (config: Record<string, any>) => {
  const obj = {
    GET: {},
    POST: {},
  } as any;
  Object.entries(config).forEach(([key, value]) => {
    const keyList = key.split(" ");
    if (keyList && !!keyList.length) {
      const method = keyList[0].toUpperCase() as "GET" | "POST";
      if (["GET", "POST"].includes(method)) {
        obj[method][keyList[1]] = value;
      }
    }
  });
  return obj;
};

export const getMockConfig = async ({ appData, malitaServer }: { appData: AppDataProps; malitaServer: Server }) => {
  return new Promise(async (resolve: (value: any) => void, reject) => {
    const dirPath = path.resolve(appData.paths.cwd, "mock");
    const files = glob.sync("**/*.ts", { cwd: dirPath });

    const mockFile = files.map((item) => path.resolve(dirPath, item));
    const mockOutDir = path.resolve(appData.paths.absTmpPath, "mock");

    await build({
      bundle: true,
      logLevel: "error",
      platform: DEFAULT_PLATFORM,
      format: "cjs",
      outdir: mockOutDir,
      external: ["esbuild"],
      entryPoints: mockFile,
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      watch: {
        onRebuild: (err, res) => {
          if (err) {
            console.log(res);
            return;
          }
          console.log("malitaServer: REBUILD");

          malitaServer.emit("REBUILD", { appData });
        },
      },
    });

    try {
      const outMockFile = glob.sync("**/*.js", { cwd: mockOutDir });
      cleanRequireCache(mockOutDir);
      const config = outMockFile.reduce((before, current) => {
        before = {
          ...before,
          ...require(path.resolve(mockOutDir, current)).default,
        };
        return before;
      }, {});
      const newConfig = normalizeConfig(config);
      resolve(newConfig);
    } catch (e) {
      reject(e);
    }
  });
};
