import glob from "glob";
import { build } from "esbuild";
import path from "path";
import { Request, Response } from "express";
import type { Express } from "express";
import { readdirSync, existsSync } from "fs-extra";
import { Server } from "http";
import type { AppDataProps } from "./appData";

const cleanRequireCache = (absMockPath: string) => {
  Object.keys(require.cache).forEach((item) => {
    if (item.indexOf(absMockPath) !== -1) delete require.cache[item];
  });
};

const getMethod = (str: string) => {
  const list = str.split(" ");
  if (list && list.length === 2) {
    return {
      method: list[0],
      url: list[1],
    };
  }
  return {
    method: "GET",
    url: str,
  };
};

const dataStructure = async (mockFile: string) => {
  const POST = {} as Record<string, any>;
  const GET = {} as Record<string, any>;
  let files = readdirSync(mockFile);
  files.forEach((item) => {
    const filePath = path.join(mockFile, item);
    delete require.cache[filePath];
    const mock = require(filePath).default;
    Object.entries(mock || {}).forEach(([key, obj]: [string, any]) => {
      const { method, url } = getMethod(key);
      if (method === "GET") {
        GET[url] = obj;
      } else {
        POST[url] = obj;
      }
    });
  });

  return { POST, GET };
};

export const getMock = async ({
  appData,
  malitaServer,
  app,
}: {
  appData: AppDataProps;
  malitaServer: Server;
  app: Express;
}) => {
  return new Promise((resolve: (res: boolean) => void, reject) => {
    try {
      glob("mock/**.ts", { absolute: true }, async function (er, files) {
        const mockFile = path.join(appData.paths.absTempPath, "mock");
        if (er) {
          resolve(false);
          return;
        }
        await build({
          bundle: true,
          external: ["esbuild"],
          outdir: mockFile,
          entryPoints: files,
          format: "cjs",
          logLevel: "error",
          charset: "utf8",
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

        if (existsSync(mockFile)) {
          cleanRequireCache(mockFile);
          const mockData = (await dataStructure(mockFile)) as any;
          app.use((req: Request, res: Response, next) => {
            const mockConfig = mockData?.[req.method]?.[req.url];
            const result = Object.prototype.toString.call(mockConfig);
            if (
              result === "[object Array]" ||
              result === "[object String]" ||
              result === "[object Object]"
            ) {
              res.json(mockConfig);
            } else if (result === "[object Function]") {
              mockConfig(req, res);
            } else next();
          });
        }
      });
      resolve(true);
    } catch (e) {
      reject(false);
    }
  });
};
