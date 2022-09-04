import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import fs from "fs-extra";
import type { AppData } from "./appData";
import { DEFAULT_GLOBAL_LAYOUTS } from "./constants";
import type { UserConfig } from "./config";

export interface IRoute {
  element: any;
  path: string;
  routes?: IRoute[];
}

const getMainPath = ({ userConfig = {} }: { userConfig: UserConfig }) => {
  let { mainPath = "index" } = userConfig;
  if (mainPath.startsWith("/")) {
    mainPath = mainPath.slice(1);
  }
  if (mainPath.endsWith("/")) {
    mainPath = mainPath.slice(0, mainPath.length - 1);
  }
  return mainPath;
};

const findTsxFile = async ({
  paths,
  userConfig = {},
  nestRoute,
}: {
  paths: string;
  userConfig: UserConfig;
  nestRoute: string;
}) => {
  const mainPath = getMainPath({ userConfig });
  const files = await readdirSync(path.join(paths, nestRoute));

  let list = [] as IRoute[];
  for (const item of files) {
    const absPath = path.join(paths, nestRoute, item);
    const stats = fs.stat(absPath);
    const isDir = (await stats).isDirectory(); //是文件夹
    if (isDir) {
      const filePath = path.join(absPath, "index.tsx");
      const fileStats = fs.stat(filePath);
      const isFile = (await fileStats).isFile(); //是文件
      if (isFile) {
        list.push({
          element: `${absPath}/index`,
          path: item === mainPath ? "/" : `${nestRoute}/${item}`,
        });
      }

      const child = await findTsxFile({ userConfig, paths, nestRoute: `${nestRoute}/${item}` });
      if (child && !!child.length) {
      }
      list = [...list, ...child];
    }
  }
  return list;
};

export const getRoutes = ({
  appData,
  userConfig,
}: {
  appData: AppData;
  userConfig: UserConfig;
}) => {
  return new Promise(async (resolve: (value: IRoute[]) => void) => {
    const routes = await findTsxFile({
      paths: appData.paths.absPagesPath,
      userConfig,
      nestRoute: "",
    });

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
