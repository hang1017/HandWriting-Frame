import express from "express";
import { build } from "esbuild";
import path from "path";
import {
  DEFAULT_OUTPUT,
  DEFAULT_POST,
  DEFAULT_ENTRY_POINTS,
  DEFAULT_HOST,
} from "./contants";

export const dev = async () => {
  const app = express();
  const cwd = process.cwd();
  const output = path.resolve(cwd, DEFAULT_OUTPUT);

  app.get("/", function (_req, res) {
    res.send(`
      <!DOCTYPE html>
      <html>
          <body>
              <div id="root">
                  <div>loading...</div>
              </div>
      
              <script src="http://${DEFAULT_HOST}:${DEFAULT_POST}/malita/index.js"></script>
          </body>
      </html>
    `);
  });

  app.use("/malita", express.static(output));

  app.listen(DEFAULT_POST, async () => {
    await build({
      bundle: true,
      outdir: DEFAULT_OUTPUT,
      platform: "node",
      external: ["esbuild"],
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINTS)],
    });
    console.log(`server start: http://${DEFAULT_HOST}:3000`);
  });
};
