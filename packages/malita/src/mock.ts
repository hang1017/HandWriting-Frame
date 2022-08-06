import glob from "glob";
import { build } from "esbuild";
import path from "path";
import { readdirSync, existsSync } from "fs-extra";
import { Server } from "http";
import type { AppDataProps } from "./appData";

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
  const post = {} as Record<string, any>;
  const get = {} as Record<string, any>;
  let files = readdirSync(mockFile);
  files.forEach((item) => {
    const filePath = path.join(mockFile, item);
    delete require.cache[filePath];
    const mock = require(filePath).default;
    Object.entries(mock || {}).forEach(([key, obj]: [string, any]) => {
      const { method, url } = getMethod(key);
      if (method === "GET") {
        get[url] = obj;
      } else {
        post[url] = obj;
      }
    });
  });

  return { post, get };
};

export const getMock = async ({
  appData,
  malitaServer,
}: {
  appData: AppDataProps;
  malitaServer: Server;
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
          delete require.cache[mockFile];
          const { post, get } = await dataStructure(mockFile);
          console.log({ post, get });
        }
      });
      resolve(true);
    } catch (e) {
      reject(false);
    }
  });
};
