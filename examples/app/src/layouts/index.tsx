import React, { useState } from "react";
import { useLocation } from "arose";
import { Button } from "antd-mobile";
import { useKeepOutlets } from "@arosejs/keepalive";
import "./index.css";

const Layout = () => {
  const [text] = useState("Hi~, click me1231");
  const { pathname } = useLocation();
  console.log("this is layout page");
  return (
    <div>
      <div className="malita-layout">
        <div>
          <Button>this is mobile button</Button>
        </div>
        {text}layouts, 当前路由：{pathname}
      </div>
      {useKeepOutlets()}
    </div>
  );
};

export default Layout;
