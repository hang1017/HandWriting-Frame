import { mkdir, writeFileSync } from "fs";
import path from "path";
import type { AppData } from "./appData";
import { DEFAULT_FRAMEWORK_NAME, DEFAULT_OUTDIR } from "./constants";
import type { UserConfig } from "./config";

const getHeadScripts = (scripts: string[]) => {
  let list: string[] = [];
  if (scripts && !!scripts.length) {
    scripts.forEach((item) => {
      list.push(`
    <script src="${item}"></script>
    `);
    });
  }
  return list;
};

export const generateHtml = ({
  appData,
  userConfig,
  isProduction = false,
}: {
  appData: AppData;
  userConfig: UserConfig;
  isProduction?: boolean;
}) => {
  return new Promise((resolve, rejects) => {
    const title = userConfig?.title ?? appData.pkg.name ?? "arose";
    const headScripts = getHeadScripts(userConfig?.headScripts || []);
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            ${headScripts.join("\n")}
            <title>${title}</title>
        </head>
        
        <body>
            <div id="arose">
                <span>loading...</span>
            </div>
            <script src="${
              isProduction ? "." : `/${DEFAULT_OUTDIR}`
            }/${DEFAULT_FRAMEWORK_NAME}.js"></script>
            ${isProduction ? "" : '<script src="/arose/client.js"></script>'}
        </body>
        </html>`;
    try {
      const htmlPath = path.resolve(appData.paths.absOutputPath, "index.html");
      mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
        if (err) {
          rejects(err);
        }
        writeFileSync(htmlPath, content, "utf-8");
        resolve({});
      });
    } catch (error) {
      rejects({});
    }
  });
};
