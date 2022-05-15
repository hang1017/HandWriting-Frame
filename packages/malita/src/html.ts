import { mkdir, writeFileSync } from "fs";
import path from "path";
import { DEFAULT_OUTDIR, DEFAULT_FRAMEWORK_NAME } from "./constants";
import { AppDataProps } from "./appData";
import { UserConfigProps } from "./config";

export const generateHtml = ({ appData, userConfig }: { appData: AppDataProps; userConfig: UserConfigProps }) => {
  return new Promise((resolve, rejects) => {
    const content = `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <title>${userConfig.title ?? appData.pkg.name ?? "Malita"}</title>
      </head>
      
      <body>
          <div id="malita">
              <span>loading...</span>
          </div>
          <script src="/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
          <script src="/malita/client.js"></script>
      </body>
      </html>
    `;

    try {
      const htmlPath = path.resolve(appData.paths.absOutputPath, "index.html");
      mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
        if (err) rejects({});
        writeFileSync(htmlPath, content, "utf-8");
        resolve({});
      });
    } catch (e) {
      rejects({});
    }
  });
};
