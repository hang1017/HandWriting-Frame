import { build as esbuild } from "esbuild";
import { DEFAULT_PLATFORM } from "./constants";
import { getAppData } from "./appData";
import { getUserConfig } from "./config";
import { getRoutes } from "./routes";
import { generateEntry } from "./entry";
import { generateHtml } from "./html";
import { style } from "./styles";

export const build = async () => {
  const cwd = process.cwd();

  // 生命周期
  // 获取项目元信息
  const appData = await getAppData({ cwd });

  // 获取用户配置信息
  const userConfig = await getUserConfig({ appData, isProduction: true });

  // 获取路由配置
  const routes = await getRoutes({ appData });

  // 生成项目的主入口
  await generateEntry({ appData, routes, userConfig });

  // 生成 html
  await generateHtml({ appData, userConfig, isProduction: true });

  esbuild({
    bundle: true,
    format: "iife",
    logLevel: "error",
    outdir: appData.paths.absOutputPath,
    platform: DEFAULT_PLATFORM,
    minify: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    external: ["esbuild"],
    plugins: [style()],
    entryPoints: [appData.paths.absEntryPath],
  });
};
