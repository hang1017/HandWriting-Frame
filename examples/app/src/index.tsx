import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import KeepAliveLayout from "@malitajs/keepalive";

import LayoutPage from "./layouts/index";
import Home from "./pages/home/index";
import User from "./pages/user/index";
import Me from "./pages/me/index";

const Hello = () => {
  const [text, setText] = React.useState("Hi~, click me1231");
  return (
    <KeepAliveLayout keepalive={["/user"]}>
      <HashRouter>
        <div onClick={() => setText("Malita")}>{text}</div>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </HashRouter>
    </KeepAliveLayout>
  );
};

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Hello));
