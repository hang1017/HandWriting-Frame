import path from "path";
import { DEFAULT_OUTPUT, DEFAULT_TMEP } from "./contants";

interface PathProps {
  cwd: string;
  absSrcPath: string;
  absPagesPath: string;
  absOutputPath: string;
  absNodeModulesPath: string;
  absTempPath: string;
}

export interface AppDataProps {
  pkg: Record<string, any>;
  paths: PathProps;
}

export const getAppData = async ({ cwd }: { cwd: string }) => {
  return new Promise((resolve: (res: AppDataProps) => void, reject) => {
    try {
      const absSrcPath = path.resolve(cwd, "src");
      const absPagesPath = path.join(absSrcPath, "pages");
      const absOutputPath = path.resolve(cwd, DEFAULT_OUTPUT);
      const absNodeModulesPath = path.resolve(cwd, "node_modules");
      const absTempPath = path.join(absNodeModulesPath, DEFAULT_TMEP);

      const data = {
        paths: {
          cwd,
          absSrcPath,
          absPagesPath,
          absOutputPath,
          absNodeModulesPath,
          absTempPath,
        },
        pkg: require(path.resolve(cwd, "package.json")),
      };

      resolve(data);
    } catch (e) {
      reject({});
    }
  });
};
