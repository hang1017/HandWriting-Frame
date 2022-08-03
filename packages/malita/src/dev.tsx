import express from "express";
import { build } from "esbuild";
import path from "path";
import { createServer } from "http";
import { DEFAULT_OUTPUT, DEFAULT_POST, DEFAULT_ENTRY_POINTS, DEFAULT_HOST } from "./contants";
import { createSocketServer } from "./server";
import { getAppData } from "./appData";
import { getRouter } from "./router";
import { styles } from "./styles";
import { getEnrty } from "./entry";

export const dev = async () => {
  const app = express();
  const malitaServer = createServer(app);
  const cwd = process.cwd();
  const output = path.resolve(cwd, DEFAULT_OUTPUT);

  const { send } = createSocketServer(malitaServer);

  app.get("/", function (_req, res) {
    res.set("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html>
          <head>
          <meta charset="UTF-8">
            <link rel="styleshreet" type="text/css" herf="http://${DEFAULT_HOST}:${DEFAULT_POST}/malita/index.css">
          </head>
          <body>
              <div id="root">
                  <div>loading...</div>
              </div>

              <script src="http://${DEFAULT_HOST}:${DEFAULT_POST}/malita/index.js"></script>
              <script src="http://${DEFAULT_HOST}:${DEFAULT_POST}/client/index.js"></script>
          </body>
      </html>
    `);
  });

  app.use("/malita", express.static(output));
  app.use("/client", express.static(path.resolve(__dirname, "client")));

  const sendMessage = (type: string) => {
    send({ type });
  };

  malitaServer.listen(DEFAULT_POST, async () => {
    const appData = await getAppData({ cwd });
    const router = await getRouter({ appData });
    await getEnrty({ appData, router });

    await build({
      bundle: true,
      outdir: output,
      platform: "node",
      format: "iife",
      external: ["esbuild"],
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      watch: {
        onRebuild: (err, _result) => {
          if (err) {
            console.log(err);
            return;
          }
          sendMessage("reload");
        },
      },
      plugins: [styles()],
      entryPoints: [path.resolve(appData.paths.absTempPath, "entry")],
    });
    console.log(`server start: http://${DEFAULT_HOST}:3000`);
  });
};
