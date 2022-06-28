import { generateFile } from "@umijs/utils";
import path from "path";
import { existsSync } from "fs";

export const generate = (args: string[]) => {
  const [type, name] = args;

  const cwd = process.cwd();
  const absSrcPath = path.resolve(cwd, "src");
  const absPagePath = path.join(absSrcPath, "pages");
  if (existsSync(absPagePath) && type && name) {
    generateFile({
      path: path.join(__dirname, `../templates/${type}`),
      target: path.join(absPagePath, name),
    });
  }
};
