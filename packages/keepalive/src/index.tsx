import React, { createContext, useRef, useContext } from "react";
import type { FC } from "react";
import { useOutlet, useLocation, matchPath } from "react-router-dom";

export interface KeepAliveLayoutProps {
  dropByCacheKey?: (pathname: string) => void;
  keepElements?: any;
  keepalive: any[];
}

export const KeepAliveContext = createContext<KeepAliveLayoutProps>({ keepalive: [], keepElements: {} });

const isKeepPath = (aliveList: any[] = [], path: string) => {
  let isKeep = false;
  aliveList.forEach((item) => {
    if (item === path) {
      isKeep = true;
    }
    if (item instanceof RegExp && item.test(path)) {
      isKeep = true;
    }
    if (typeof item === "string" && item.toLowerCase() === path) {
      isKeep = true;
    }
  });
  return isKeep;
};

export function useKeepOutlets() {
  const location = useLocation();
  const element = useOutlet();
  const { keepalive = [], keepElements } = useContext<any>(KeepAliveContext);
  const isKeep = isKeepPath(keepalive, location.pathname);

  if (isKeep) {
    keepElements.current[location.pathname] = element;
  }

  return (
    <>
      {Object.entries(keepElements.current).map(([pathname, element]: any) => (
        <div
          key={pathname}
          hidden={!matchPath(location.pathname, pathname)}
          style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden auto" }}
          className="rumtime-keep-alive-layout"
        >
          {element}
        </div>
      ))}
      <div
        key={location.pathname}
        hidden={isKeep}
        style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden auto" }}
        className="rumtime-keep-alive-layout-no"
      >
        {!isKeep && element}
      </div>
    </>
  );
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
  const { keepalive, ...other } = props;
  const keepElements = useRef<any>({});
  const dropByCacheKey = (pathname: string) => {
    keepElements.current[pathname] = null;
  };
  return <KeepAliveContext.Provider value={{ dropByCacheKey, keepElements, keepalive }} {...other} />;
};

export default KeepAliveLayout;
