import { mkdir, writeFileSync } from "fs";
import path from "path";
import { AppDataProps } from "./appData";
import { RouteProps } from "./routes";

let i = 1;

const getRouteStr = (routers: RouteProps[]) => {
  let routesStr = "";
  let importStr = "";

  routers.map((item) => {
    i += 1;
    importStr += `import A${i} from '${item.element}';\n`;
    routesStr += `<Route path="${item.path}" element={<A${i} />}>\n`;
    if (item.routes) {
      const { routesStr: rs, importStr: is } = getRouteStr(item.routes);
      importStr += is;
      routesStr += rs;
    }
    routesStr += "</Route>\n";
  });
  return { routesStr, importStr };
};

export const generateEntry = async ({ appData, routers }: { appData: AppDataProps; routers: RouteProps[] }) => {
  return new Promise((resolve: any, rejects: any) => {
    const { importStr, routesStr } = getRouteStr(routers);

    const content = `import React from "react";
    import ReactDOM from "react-dom/client";
    import { HashRouter, Routes, Route } from "react-router-dom";
    import KeepAliveLayout from "@malitajs/keepalive";
    
    ${importStr}
    
    const App = () => {
      return (
        <KeepAliveLayout keepalive={["/users"]}>
          <HashRouter>
            <Routes>
              ${routesStr}
            </Routes>
          </HashRouter>
        </KeepAliveLayout>
      );
    };
    
    // @ts-ignore
    const root = ReactDOM.createRoot(document.getElementById("malita"));
    root.render(React.createElement(App));
    `;
    resolve([]);

    try {
      mkdir(path.dirname(appData.paths.absEntryPath), { recursive: true }, (err) => {
        if (err) rejects(err);

        writeFileSync(appData.paths.absEntryPath, content, "utf-8");
        resolve({});
      });
    } catch (err) {
      rejects(err);
    }
  });
};
