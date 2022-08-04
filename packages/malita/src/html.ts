import path from "path";
import { ensureDirSync, writeFile } from "fs-extra";
import type { AppDataProps } from "./appData";
import type { ConfigProps } from "./config";
import { DEFAULT_POST, DEFAULT_HOST, DEFAULT_OUTPUT, DEFAULT_FRAMEWORK_NAME } from "./contants";

const htmls = ({ config }: { config: ConfigProps }) => {
  return `
  <!DOCTYPE html>
  <html>
      <head>
      <title>${config?.title || "malita"}</title>
        <meta charset="UTF-8">
      </head>
      <body>
          <div id="root">
              <div>loading...</div>
          </div>

          <script src="http://${DEFAULT_HOST}:${DEFAULT_POST}/${DEFAULT_OUTPUT}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
          <script src="http://${DEFAULT_HOST}:${DEFAULT_POST}/client/index.js"></script>
      </body>
  </html>
  `;
};

export const getHtml = async ({
  appData,
  config,
}: {
  appData: AppDataProps;
  config: ConfigProps;
}) => {
  return new Promise((resolve: (res: boolean) => void, reject) => {
    try {
      const content = htmls({ config });
      ensureDirSync(appData.paths.absOutputPath);
      writeFile(path.join(appData.paths.absOutputPath, "index.html"), content, "utf-8");
      resolve(true);
    } catch (e) {
      reject();
    }
  });
};
