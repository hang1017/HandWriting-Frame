import type { AppDataProps } from "./appData";
import fs, { readdirSync, existsSync } from "fs-extra";
import path from "path";

export interface RouteProps {
  path: string;
  element: string;
  children?: RouteProps[];
}

const findTsxFile = async (paths: string) => {
  const files = await readdirSync(paths);
  const list = [] as RouteProps[];
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
          path: item === "home" ? "/" : `/${item}`,
        });
      }
    }
  }
  return list;
};

export const getRouter = async ({ appData }: { appData: AppDataProps }) => {
  return new Promise(async (resolve: (res: RouteProps[]) => void, reject) => {
    try {
      const pagesPath = appData.paths.absPagesPath;
      let files = await findTsxFile(pagesPath);

      const layoutPath = path.join(appData.paths.absSrcPath, "layouts", "index.tsx");
      const isFile = await existsSync(layoutPath);
      if (isFile) {
        files = [
          {
            path: "/",
            element: `${path.join(appData.paths.absSrcPath, "layouts")}/index`,
            children: files,
          },
        ];
      }
      resolve(files);
    } catch (e) {
      reject([]);
    }
  });
};
