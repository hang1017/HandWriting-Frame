import express from "express";
import { build } from "esbuild";
import path from "path";
import { createServer } from "http";
import portfinder from "portfinder";
import { createWebSocketServer } from "./server";
import { DEFAULT_PORT, DEFAULT_HOST, DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_ENTRY_POINT } from "./constants";
import { styles } from "./styles";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();

  const port = await portfinder.getPortPromise({
    port: DEFAULT_PORT,
  });
  app.get("/", (_req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>Malita</title>
    </head>
    
    <body>
        <div id="malita">
            <span>loading...</span>
            <script src='/${DEFAULT_OUTDIR}/index.js'></script>
            <script src='/malita/client.js'></script>
        </div>
    </body>
    </html>
  `);
  });

  const malitaServer = createServer(app);
  const ws = createWebSocketServer(malitaServer);

  const esbuildOutput = path.resolve(cwd, DEFAULT_OUTDIR);
  app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput));
  app.use(`/malita`, express.static(path.resolve(__dirname, "client")));

  const sendMessage = (type: string, data?: any) => {
    ws.send(JSON.stringify({ type, data }));
  };

  malitaServer.listen(port, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${DEFAULT_PORT}`);

    try {
      await build({
        bundle: true,
        outdir: DEFAULT_OUTDIR,
        platform: DEFAULT_PLATFORM,
        logLevel: "error",
        format: "iife",
        define: {
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        watch: {
          onRebuild: (err, res) => {
            if (err) {
              console.log(res);
              return;
            }
            sendMessage("reload");
          },
        },
        plugins: [styles()],
        external: ["esbuild"],
        entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
      });
    } catch (e) {
      process.exit(1);
    }
  });
};
