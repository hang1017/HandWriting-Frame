import { AppDataProps } from "./appData";
import { RouteProps } from "./routes";

const getRouteStr = (routers: RouteProps[]) => {
  let routesStr = "";
  let importStr = "";

  let i = 1;
  routers.map((item) => {
    importStr += `import A${i} from ${item.element};\n`;
    routesStr += `<Route path="${item.path}" element={<A${i} />}>\n`;
    if (item.routes) {
      const { routesStr: rs, importStr: is } = getRouteStr(item.routes);
      importStr += is;
      routesStr += rs;
    }
    i++;
    routesStr += "</Route>\n";
  });
  return { routesStr, importStr };
};

export const generateEntry = async ({ appData, routers }: { appData: AppDataProps; routers: RouteProps[] }) => {
  return new Promise((resolve: any) => {
    const { importStr, routesStr } = getRouteStr(routers);
    console.log(importStr, routesStr);

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
  });
};
