import express from "express";
import { build } from "esbuild";
import path from "path";
import fs from "fs";
import { createServer } from "http";
import portfinder from "portfinder";
import { createWebSocketServer } from "./server";
import { DEFAULT_PORT, DEFAULT_HOST, DEFAULT_OUTDIR, DEFAULT_PLATFORM } from "./constants";
import { styles } from "./styles";
import { getAppData } from "./appData";
import { getRoutes } from "./routes";
import { generateEntry } from "./entry";
import { generateHtml } from "./html";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();

  const port = await portfinder.getPortPromise({
    port: DEFAULT_PORT,
  });
  const output = path.resolve(cwd, DEFAULT_OUTDIR);
  app.get("/", (_req, res, next) => {
    res.set("Content-Type", "text/html");
    const htmlPath = path.join(output, "index.html");
    if (fs.existsSync(htmlPath)) {
      fs.createReadStream(htmlPath).on("error", next).pipe(res);
    } else {
      next();
    }
  });

  const malitaServer = createServer(app);
  const ws = createWebSocketServer(malitaServer);

  app.use(`/${DEFAULT_OUTDIR}`, express.static(output));
  app.use(`/malita`, express.static(path.resolve(__dirname, "client")));

  const sendMessage = (type: string, data?: any) => {
    ws.send(JSON.stringify({ type, data }));
  };

  malitaServer.listen(port, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${DEFAULT_PORT}`);

    const appData = await getAppData({ cwd });
    const routers = await getRoutes({ appData });
    await generateEntry({ appData, routers });
    await generateHtml({ appData });

    try {
      await build({
        bundle: true,
        outdir: appData.paths.absOutputPath,
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
        entryPoints: [appData.paths.absEntryPath],
      });
    } catch (e) {
      process.exit(1);
    }
  });
};
