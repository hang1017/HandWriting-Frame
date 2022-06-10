import React from "react";
import { useKeepOutlets } from "@malitajs/keepalive";
import { useLocation } from "react-router-dom";
import { Page, Header, Content } from "@alita/flow";

import "./index.css";

const Layout = () => {
  const { pathname } = useLocation();
  const element = useKeepOutlets();
  return (
    <Page>
      <div className="layout-style">layout</div>
      <Header>当前路由: {pathname}</Header>
      <Content>{element}</Content>
    </Page>
  );
};

export default Layout;
