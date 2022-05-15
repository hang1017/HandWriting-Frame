import { mkdir, writeFileSync } from "fs";
import path from "path";
import { IRoute } from "./routes";
import type { AppDataProps } from "./appData";
import type { UserConfigProps } from "./config";

let count = 1;

const getRouteStr = (routes: IRoute[]) => {
  let routesStr = "";
  let importStr = "";

  routes.forEach((route) => {
    count += 1;
    importStr += `import A${count} from '${route.element}';\n`;
    routesStr += `\n<Route path='${route.path}' element={<A${count}/>}>`;
    if (route.routes) {
      const { importStr: is, routesStr: rs } = getRouteStr(route.routes);
      importStr += is;
      routesStr += rs;
    }
    routesStr += `</Route> \n`;
  });
  return { importStr, routesStr };
};

const configStringify = (config: (string | RegExp)[]) => {
  return config.map((item) => {
    if (item instanceof RegExp) {
      return item;
    }
    return `'${item}'`;
  });
};

export const generateEntry = ({
  routes,
  appData,
  userConfig,
}: {
  routes: IRoute[];
  appData: AppDataProps;
  userConfig: UserConfigProps;
}) => {
  return new Promise((resolve, rejects) => {
    count = 0;
    const { importStr, routesStr } = getRouteStr(routes);

    const content = `
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { HashRouter, Routes, Route } from "react-router-dom";
  import KeepAliveLayout from "@malitajs/keepalive";
  ${importStr}

  const App = () => {
    return (
      <KeepAliveLayout keepalive={[${configStringify(userConfig?.keepalive || [])}]}>
        <HashRouter>
          <Routes>
            ${routesStr}
          </Routes>
        </HashRouter>
      </KeepAliveLayout>
    );
  };
  
  const root = ReactDOM.createRoot(document.getElementById("malita"));
  root.render(React.createElement(App));
  `;

    try {
      mkdir(path.dirname(appData.paths.absEntryPath), { recursive: true }, (err) => {
        if (err) rejects({});
        writeFileSync(appData.paths.absEntryPath, content, "utf-8");
        resolve({});
      });
    } catch (e) {
      rejects({});
    }
  });
};
