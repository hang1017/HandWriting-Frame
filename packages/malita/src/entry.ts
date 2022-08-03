import { ensureDirSync, writeFile } from "fs-extra";
import path from "path";
import type { AppDataProps } from "./appData";
import type { RouteProps } from "./router";

const getRouteText = (router: RouteProps[], index: number) => {
  let i = 0;
  let impStr = "";
  let rouStr = "";
  router.forEach((item: RouteProps) => {
    i += 1;
    impStr += `import A${index}${i} from "${item.element}";\n`;
    rouStr += `<Route path="${item.path}" element={<A${index}${i} />}>\n`;
    if (item?.children) {
      const { impStr: is, rouStr: rs } = getRouteText(item?.children, index + 1);
      impStr += is;
      rouStr += rs;
    }
    rouStr += `</Route>\n`;
  });
  return { impStr, rouStr };
};

const getRouteHtml = ({ impStr, rouStr }: { impStr: string; rouStr: string }) => {
  return `
    import React from "react";
    import ReactDOM from "react-dom/client";
    import { HashRouter, Route, Routes } from "react-router-dom";
    import KeepAliveLayout from "@malitajs/keepalive";
    ${impStr}
    const Hello = () => {
      const [text, setText] = React.useState("Hi~, click me1231");
      return (
        <KeepAliveLayout keepalive={["/user"]}>
          <HashRouter>
            <div onClick={() => setText("Malita")}>{text}</div>
            <Routes>
              ${rouStr}
            </Routes>
          </HashRouter>
        </KeepAliveLayout>
      );
    };
    // @ts-ignore
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(React.createElement(Hello));
  `;
};

export const getEnrty = async ({
  appData,
  router,
}: {
  appData: AppDataProps;
  router: RouteProps[];
}) => {
  return new Promise((resolve: (res: boolean) => void, reject) => {
    try {
      const text = getRouteText(router, 0);
      const content = getRouteHtml(text);
      ensureDirSync(appData.paths.absTempPath);
      writeFile(path.join(appData.paths.absTempPath, "entry.tsx"), content);
      resolve(true);
    } catch (e) {}
    reject(false);
  });
};
