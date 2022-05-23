import path from "path";
import fs from "fs";
import { lodash, generateFile, prompts } from "@umijs/utils";

export const generate = async (args: string[]) => {
  const [type, name] = args;
  const cwd = process.cwd();
  const absSrcPath = path.resolve(cwd, "src");
  const absPagePath = path.resolve(absSrcPath, "pages");
  if ((fs.existsSync(absPagePath) && type, name)) {
    const questions = [
      {
        name: "hi",
        type: "text",
        message: `What's your name?`,
      },
      {
        name: "age",
        type: "text",
        message: "what is your age",
      },
    ] as prompts.PromptObject[];

    generateFile({
      path: path.resolve(__dirname, `../templates/${type}`),
      target: path.join(absPagePath, name),
      data: {
        name: lodash.upperFirst(name),
      },
      questions,
    });
  }
};
