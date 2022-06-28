import { mkdir, writeFileSync } from "fs";
import path from "path";
import { DEFAULT_OUTDIR, DEFAULT_FRAMEWORK_NAME } from "./constants";
import { AppDataProps } from "./appData";
import { UserConfigProps } from "./config";

export const generateHtml = async ({
  appData,
  userConfig,
  isProduction = true,
}: {
  appData: AppDataProps;
  userConfig: UserConfigProps;
  isProduction: boolean;
}) => {
  return new Promise((resolve, rejects) => {
    const content = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>${userConfig?.title || "malita"}</title>
    </head>
    
    <body>
        <div id="malita">
            <span>loading...</span>
            <script src='${isProduction ? `.` : `/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js`}'></script>
            ${isProduction ? "" : '<script src="/malita/client.js"></script>'}
        </div>
    </body>
    </html>`;

    try {
      const htmlPath = path.resolve(appData.paths.absOutputPath, "index.html");
      mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
        if (err) rejects(err);
        writeFileSync(htmlPath, content, "utf-8");
        resolve({});
      });
    } catch (err) {
      rejects(err);
    }
  });
};
