import React from "react";
import { Page, Content, Header } from "@alita/flow";
import { useLocation } from "react-router-dom";
import { useKeepOutlets } from "@malitajs/keepalive";

import "./index.css";

const Layout = () => {
  const { pathname } = useLocation();
  const element = useKeepOutlets();
  return (
    <Page>
      <div className="malita-layout">Layouts</div>
      <Header>当前路由: {pathname}</Header>
      <Content>{element}</Content>
    </Page>
  );
};

export default Layout;
