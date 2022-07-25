import express from "express";
import { build } from "esbuild";
import path from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { createWsServer } from "./server";
import {
  DEFAULT_OUTPUT,
  DEFAULT_POST,
  DEFAULT_ENTRY_POINTS,
  DEFAULT_HOST,
} from "./contants";

export const dev = async () => {
  const app = express();
  const cwd = process.cwd();
  const server = createServer(app);
  const { wss, send } = createWsServer(server);
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
              <script src="http://${DEFAULT_HOST}:${DEFAULT_POST}/client/index.js"></script>
          </body>
      </html>
    `);
  });

  console.log("__dirname: ", __dirname);

  app.use("/malita", express.static(output));
  app.use("/client", express.static(path.resolve(__dirname, "client")));

  const sendMessage = (text: string) => {
    send(JSON.stringify(text));
  };

  server.listen(DEFAULT_POST, async () => {
    await build({
      bundle: true,
      outdir: DEFAULT_OUTPUT,
      platform: "node",
      external: ["esbuild"],
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      watch: {
        onRebuild: (error) => {
          if (error) {
            console.log(error);
            return;
          }
          sendMessage("reload");
        },
      },
      entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINTS)],
    });
    console.log(`server start: http://${DEFAULT_HOST}:3000`);
  });
};
