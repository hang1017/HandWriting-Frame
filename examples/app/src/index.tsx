import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Page, Content, Header } from "@alita/flow";
import KeepAliveLayout, { KeepAliveContext, useKeepOutlets } from "@malitajs/keepalive";

import Layout from "./layouts";
import Home from "./pages/home";
import Me from "./pages/me";
import Users from "./pages/users";

const App = () => {
  return (
    <KeepAliveLayout keepalive={["/"]}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </HashRouter>
    </KeepAliveLayout>
  );
};

const root = ReactDOM.createRoot(document.getElementById("malita"));
root.render(React.createElement(App));