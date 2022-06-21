import { AppDataProps } from "./appData";
import fs from "fs";
import path from "path";
import { DEFAULT_GLOBAL_LAYOUTS } from "./constants";

export interface RouteProps {
  path: string;
  element: any;
  routes?: RouteProps[];
}

const getFiles = (root: string) => {
  if (!fs.existsSync(root)) return [];
  const filter = fs.readdirSync(root).filter((item: string) => {
    const file = path.join(root, item);
    const fileStat = fs.statSync(file);
    const isFile = fileStat.isFile();
    if (isFile) {
      if (/.tsx?$/.test(file)) return true;
    }
    return false;
  });

  return filter;
};

const filesToRoutes = (files: string[], pagesPath: string) => {
  return files.map((item) => {
    const paths = path.basename(item, path.extname(item));
    const element = path.resolve(pagesPath, paths);
    return {
      element,
      path: paths === "index" ? "/" : `/${paths}`,
    };
  });
};

export const getRoutes = async ({ appData }: { appData: AppDataProps }) => {
  return new Promise((resolve: (obj: RouteProps[]) => void) => {
    const files = getFiles(appData.paths.absPagesPath);
    const routes = filesToRoutes(files, appData.paths.absPagesPath);
    const layoutPath = path.resolve(appData.paths.absSrcPath, DEFAULT_GLOBAL_LAYOUTS);
    if (!layoutPath) {
      resolve(routes);
    } else {
      resolve([
        {
          path: "/",
          routes,
          element: layoutPath.replace(path.extname(layoutPath), ""),
        },
      ]);
    }
  });
};
