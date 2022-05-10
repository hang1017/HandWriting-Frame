import express from "express";
import { build } from "esbuild";
import portfinder from "portfinder";
import path from "path";
import { createServer } from "http";
import { DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_ENTRY_POINT } from "./constants";
import { createWebSocketServer } from "./server";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();
  const server = createServer(app);

  const ws = createWebSocketServer(server);

  const port = await portfinder.getPortPromise({
    port: DEFAULT_PORT,
  });

  app.get("/", (_req, res) => {
    res.set("Content-type", "text/html");
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Malita</title>
    </head>
    
    <body>
        <div id="malita">
            <span>loading...</span>
        </div>
        <script src="/${DEFAULT_OUTDIR}/index.js"></script>
        <script src="/malita/client.js"></script>
    </body>
    
    </html>`);
  });

  const esbuildOutput = path.resolve(cwd, DEFAULT_OUTDIR);

  app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput));

  app.use(`/malita`, express.static(path.resolve(__dirname, "client")));

  function sendMessage(type: string, data?: any) {
    ws.send(JSON.stringify({ type, data }));
  }

  server.listen(port, async () => {
    console.log(`demo服务器已启动，访问地址 http://${DEFAULT_HOST}:${DEFAULT_PORT}`);

    try {
      await build({
        outdir: esbuildOutput,
        platform: DEFAULT_PLATFORM,
        bundle: true,
        format: "iife",
        logLevel: "error",
        watch: {
          onRebuild(error, _res) {
            if (error) {
              console.error("watch build failed:", error);
              return;
            }
            sendMessage("reload");
          },
        },
        entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
      });
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });
};
