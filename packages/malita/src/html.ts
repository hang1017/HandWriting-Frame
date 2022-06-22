import { mkdir, writeFileSync } from "fs";
import path from "path";
import { DEFAULT_OUTDIR, DEFAULT_FRAMEWORK_NAME } from "./constants";
import { AppDataProps } from "./appData";

export const generateHtml = async ({ appData }: { appData: AppDataProps }) => {
  return new Promise((resolve, rejects) => {
    const content = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Malita</title>
    </head>
    
    <body>
        <div id="malita">
            <span>loading...</span>
            <script src='/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js'></script>
            <script src='/malita/client.js'></script>
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
