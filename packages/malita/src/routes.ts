import { existsSync, readdirSync, statSync } from "fs";
import path from "path";
import { AppDataProps } from "./appData";
import { DEFAULT_GLOBAL_LAYOUTS } from "./constants";

export interface IRoute {
  element: any;
  path: string;
  routes?: IRoute[];
}

/**
 * 读取路径下的第一层级文件
 * 过滤掉非文件和非 .tsx 后缀的文件名
 */
const getFiles = (root: string) => {
  if (!existsSync(root)) return [];
  return readdirSync(root).filter((file: string) => {
    const absFile = path.join(root, file);
    const fileStat = statSync(absFile);
    const isFile = fileStat.isFile();
    if (isFile) {
      if (!/\.tsx?$/.test(file)) return false;
    }
    return true;
  });
};

const filesToRoutes = (files: string[], pagesPath: string) => {
  return files.map((i) => {
    let pagePath = path.basename(i, path.extname(i));
    const element = path.resolve(pagesPath, pagePath);
    if (pagePath === "home") pagePath = "";
    return {
      path: `/${pagePath}`,
      element,
    };
  });
};

export const getRoutes = ({ appData }: { appData: AppDataProps }) => {
  return new Promise((resolve: (value: IRoute[]) => void) => {
    const files = getFiles(appData.paths.absPagesPath);
    const routes = filesToRoutes(files, appData.paths.absPagesPath);
    const layoutPath = path.resolve(appData.paths.absSrcPath, DEFAULT_GLOBAL_LAYOUTS);
    if (!existsSync(layoutPath)) {
      resolve(routes);
    } else {
      resolve([
        {
          path: "/",
          element: layoutPath.replace(path.extname(layoutPath), ""),
          routes,
        },
      ]);
    }
  });
};
