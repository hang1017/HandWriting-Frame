import path from "path";
import { DEFAULT_TEMPLATE, DEFAULT_OUTDIR, DEFAULT_ENTRY_POINT } from "./constants";

interface Options {
  cwd: string;
}

export interface AppDataProps {
  paths: {
    cwd: string;
    absSrcPath: string; // src 下的路径
    absPagesPath: string; // 页面路径
    absTmpPath: string; // 临时文件路径
    absOutputPath: string; // 输出目录绝对路径
    absEntryPath: string; // 主入口文件的绝对路径
    absNodeModulesPath: string; // node_modules 路径
  };
  pkg: Record<string, any>;
}

export const getAppData = ({ cwd }: Options) => {
  return new Promise((reslove: (value: AppDataProps) => void, rejects) => {
    const absSrcPath = path.resolve(cwd, "src");
    const absPagesPath = path.resolve(absSrcPath, "pages");
    const absNodeModulesPath = path.resolve(cwd, "node_modules");
    const absTmpPath = path.resolve(absNodeModulesPath, DEFAULT_TEMPLATE);
    const absOutputPath = path.resolve(cwd, DEFAULT_OUTDIR);
    const absEntryPath = path.resolve(absTmpPath, DEFAULT_ENTRY_POINT);

    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absNodeModulesPath,
      absTmpPath,
      absOutputPath,
      absEntryPath,
    };
    const pkg = require(path.resolve(cwd, "package.json"));
    reslove({ paths, pkg });
  });
};
