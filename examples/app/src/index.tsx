import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Link, Outlet, useLocation } from "react-router-dom";
import { Page, Header, Content } from "@alita/flow";

const Layout = () => {
  const { pathname } = useLocation();
  return (
    <Page>
      <Header>当前路由: {pathname}</Header>
      <Content>
        <Outlet />
      </Content>
    </Page>
  );
};

const Hello = () => {
  const [text, setText] = useState<string>("hi");

  return (
    <div onClick={() => setText("hi aaaa")}>
      {text}
      <Link to="/users">to User click</Link>
    </div>
  );
};

const Users = () => {
  return (
    <>
      <p> Users </p>
      <Link to="/me">Me</Link>
    </>
  );
};

const Me = () => {
  return (
    <>
      <p> Me </p> <Link to="/">go Home</Link>
    </>
  );
};

const App = () => {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Hello />} />
            <Route path="/users" element={<Users />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
};

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("malita"));
root.render(React.createElement(App));
