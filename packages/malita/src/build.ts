import { getAppData } from "./appData";
import { getRoutes } from "./routes";
import { getUserConfig } from "./config";
import { generateEntry } from "./entry";
import { generateHtml } from "./html";

export const build = async () => {
  const cwd = process.cwd();
  const appData = await getAppData({ cwd });
  const routers = await getRoutes({ appData });
  const userConfig = await getUserConfig({ appData, isProduction: true });
  await generateEntry({ appData, routers, userConfig });
  await generateHtml({ appData, userConfig, isProduction: true });
};
