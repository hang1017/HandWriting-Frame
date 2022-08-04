import express from "express";
import { build } from "esbuild";
import path from "path";
import { createServer } from "http";
import { existsSync, createReadStream } from "fs-extra";
import { DEFAULT_OUTPUT, DEFAULT_POST, DEFAULT_HOST } from "./contants";
import { createSocketServer } from "./server";
import { getAppData } from "./appData";
import { getRouter } from "./router";
import { styles } from "./styles";
import { getEnrty } from "./entry";
import { getHtml } from "./html";
import { getConfig } from "./config";

export const dev = async () => {
  const app = express();
  const malitaServer = createServer(app);
  const cwd = process.cwd();
  const output = path.resolve(cwd, DEFAULT_OUTPUT);

  const { send } = createSocketServer(malitaServer);

  app.get("/", function (_req, res, next) {
    res.set("Content-Type", "text/html");
    const htmlPath = path.join(output, "index.html");
    if (existsSync(htmlPath)) {
      createReadStream(htmlPath).on("error", next).pipe(res);
    } else {
      next();
    }
  });

  app.use(`/${DEFAULT_OUTPUT}`, express.static(output));
  app.use("/client", express.static(path.resolve(__dirname, "client")));

  const sendMessage = (type: string) => {
    send({ type });
  };

  malitaServer.listen(DEFAULT_POST, async () => {
    const appData = await getAppData({ cwd });
    const config = await getConfig({ appData, sendMessage });
    const router = await getRouter({ appData });
    await getEnrty({ appData, router });
    await getHtml({ appData, config });

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
      entryPoints: [appData.paths.absEntryPointPath],
    });
    console.log(`server start: http://${DEFAULT_HOST}:3000`);
  });
};
