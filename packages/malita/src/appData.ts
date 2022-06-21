import path from "path";
import { DETAULT_TEMPLATE, DEFAULT_ENTRY_POINT, DEFAULT_OUTDIR } from "./constants";

export interface Options {
  cwd: string;
}

export interface AppDataProps {
  paths: {
    cwd: string;
    absSrcPath: string;
    absPagesPath: string;
    absTmpPath: string;
    absOutputPath: string;
    absEntryPath: string;
    absNodeModulesPath: string;
  };
  pkg: any;
}

export const getAppData = async ({ cwd }: Options) => {
  const absSrcPath = path.resolve(cwd, "src");
  const absPagesPath = path.resolve(absSrcPath, "pages");
  const absNodeModulesPath = path.resolve(cwd, "node_modules");
  const absTmpPath = path.resolve(absNodeModulesPath, DETAULT_TEMPLATE);
  const absEntryPath = path.resolve(absTmpPath, DEFAULT_ENTRY_POINT);
  const absOutputPath = path.resolve(cwd, DEFAULT_OUTDIR);
  const paths = { absSrcPath, absPagesPath, absNodeModulesPath, absTmpPath, absEntryPath, absOutputPath, cwd };
  const pkg = require(path.resolve(cwd, "package.json"));

  return new Promise((resolve: (obj: AppDataProps) => void) => {
    resolve({
      paths,
      pkg,
    });
  });
};
