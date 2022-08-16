import path from "path";
import { generateFile } from "@umijs/utils";

export const generate = async (pageName: string) => {
  const cwd = process.cwd();
  await generateFile({
    path: path.resolve(__dirname, "..", "templates", "pages"),
    target: path.resolve(cwd, "src", "pages", pageName),
  });
};
