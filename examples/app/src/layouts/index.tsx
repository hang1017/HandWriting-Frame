import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useOutletContent } from "@malitajs/keepalive";

const Layout = () => {
  const [text] = useState("Hi~, click me1231");
  const { pathname } = useLocation();
  return (
    <div>
      <div>
        {text}layouts, 当前路由：{pathname}
      </div>
      {useOutletContent()}
    </div>
  );
};

export default Layout;
