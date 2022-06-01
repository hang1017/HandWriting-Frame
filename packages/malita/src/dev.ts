import express from "express";
import { serve, ServeOnRequestArgs } from "esbuild";
import path from "path";
import {
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_ENTRY_POINT,
  DEFAULT_BUILD_PORT,
} from "./constants";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();
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
            <script src='http://${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}/index.js'></script>
        </div>
    </body>
    </html>
  `);
  });

  app.listen(DEFAULT_PORT, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${DEFAULT_PORT}`);

    try {
      const devServe = await serve(
        {
          port: DEFAULT_BUILD_PORT,
          host: DEFAULT_HOST,
          servedir: DEFAULT_OUTDIR,
          onRequest: (args: ServeOnRequestArgs) => {
            if (args.timeInMS) {
              console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`);
            }
          },
        },
        {
          bundle: true,
          outdir: DEFAULT_OUTDIR,
          platform: DEFAULT_PLATFORM,
          logLevel: "error",
          format: "iife",
          define: {
            "process.env.NODE_ENV": JSON.stringify("development"),
          },
          external: ["esbuild"],
          entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
        }
      );

      process.on("SIGINT", () => {
        devServe.stop();
        process.exit(0);
      });
      process.on("SIGTERM", () => {
        devServe.stop();
        process.exit(1);
      });
    } catch (e) {
      process.exit(1);
    }
  });
};
