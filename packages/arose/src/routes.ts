import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import fs from "fs-extra";
import type { AppData } from "./appData";
import { DEFAULT_GLOBAL_LAYOUTS } from "./constants";

export interface IRoute {
  element: any;
  path: string;
  routes?: IRoute[];
}

const findTsxFile = async (paths: string) => {
  const files = await readdirSync(paths);
  const list = [] as IRoute[];
  for (const item of files) {
    const absPath = path.join(paths, item);
    const stats = fs.stat(absPath);
    const isDir = (await stats).isDirectory(); //是文件夹
    if (isDir) {
      const filePath = path.join(absPath, "index.tsx");
      const fileStats = fs.stat(filePath);
      const isFile = (await fileStats).isFile(); //是文件
      if (isFile) {
        list.push({
          element: `${absPath}/index`,
          path: item === "index" ? "/" : `/${item}`,
        });
      }
    }
  }
  return list;
};

export const getRoutes = ({ appData }: { appData: AppData }) => {
  return new Promise(async (resolve: (value: IRoute[]) => void) => {
    const routes = await findTsxFile(appData.paths.absPagesPath);
    const layoutPath = path.resolve(appData.paths.absSrcPath, DEFAULT_GLOBAL_LAYOUTS);
    if (!existsSync(layoutPath)) {
      resolve(routes);
    } else {
      resolve([
        {
          path: "/",
          element: layoutPath.replace(path.extname(layoutPath), ""),
          routes: routes,
        },
      ]);
    }
  });
};
