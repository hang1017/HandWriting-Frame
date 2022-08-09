import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd-mobile";
import { useOutletContent } from "@malitajs/keepalive";
import "./index.css";

const Layout = () => {
  const [text] = useState("Hi~, click me1231");
  const { pathname } = useLocation();
  return (
    <div>
      <div className="malita-layout">
        <div>
          <Button>this is mobile button</Button>
        </div>
        {text}layouts, 当前路由：{pathname}
      </div>
      {useOutletContent()}
    </div>
  );
};

export default Layout;
