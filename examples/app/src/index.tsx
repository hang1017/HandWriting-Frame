import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import KeepAliveLayout from "@malitajs/keepalive";

import Layout from "./layouts/index";
import Hello from "./pages/index";
import Users from "./pages/users";
import Me from "./pages/me";

const App = () => {
  return (
    <KeepAliveLayout keepalive={["/users"]}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Hello />} />
            <Route path="/users" element={<Users />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </HashRouter>
    </KeepAliveLayout>
  );
};

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("malita"));
root.render(React.createElement(App));
