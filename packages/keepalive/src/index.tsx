import { useRef, useContext } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { KeepaliveContext } from "./context";

const isKeepPath = (path: string, list: (string | RegExp)[]) => {
  let flag = false;
  list.forEach((item) => {
    if (typeof item === "string" && item === path) {
      flag = true;
    }
    if (item instanceof RegExp && item.test(path)) {
      flag = true;
    }
    if (typeof item === "string" && item === path.toLocaleLowerCase()) {
      flag = true;
    }
  });
  return flag;
};

export const useOutletContent = () => {
  const { keepElements, keepalive = [] } = useContext(KeepaliveContext);
  const location = useLocation();
  const ele = useOutlet();
  const { pathname = "" } = location;
  const isKeepFlag = isKeepPath(pathname, keepalive);

  if (isKeepFlag && !keepElements.current[pathname]) {
    keepElements.current[pathname] = ele;
  }
  const elements = (
    <>
      {Object.entries(keepElements.current).map(
        ([path, element]: [string, any]) => {
          return (
            <div
              className="malita-keep-layout"
              key={path}
              style={{
                height: "100%",
                width: "100%",
                position: "relative",
                overflow: "hidden auto",
              }}
              hidden={path !== pathname}
            >
              {element}
            </div>
          );
        }
      )}
      {!isKeepFlag && (
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            overflow: "hidden auto",
          }}
          className="malita-keep-layout-no"
        >
          {ele}
        </div>
      )}
    </>
  );

  return elements;
};

const KeepAliveLayout = (props: any) => {
  const { keepalive = [], ...otherProps } = props;

  const keepElements = useRef<Record<string, any>>({});

  const dorpByCacheKey = (path: string) => {
    delete keepElements.current[path];
  };

  return (
    <KeepaliveContext.Provider
      value={{ keepalive, keepElements, dorpByCacheKey }}
      {...otherProps}
    />
  );
};

export { KeepaliveContext };

export default KeepAliveLayout;
