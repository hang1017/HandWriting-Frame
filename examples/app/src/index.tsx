import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Link, Outlet, useLocation } from "react-router-dom";
import { Page, Header, Content } from "@alita/flow";
import KeepAliveLayout, { useKeepOutlets, KeepAliveContext } from "@malitajs/keepalive";

const Layout = () => {
  const { pathname } = useLocation();
  const element = useKeepOutlets();
  return (
    <Page>
      <Header>当前路由: {pathname}</Header>
      <Content>{element}</Content>
    </Page>
  );
};

const Hello = () => {
  const [text, setText] = useState<string>("hi");
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  useEffect(() => {
    console.log("this is /");
  }, []);

  return (
    <div>
      <div onClick={() => setText("hi aaaa")}>{text}</div>
      <Link to="/users">to User click</Link>
      <div>
        <input style={{ background: "yellow" }} />
      </div>
      <button onClick={() => dropByCacheKey("/users")}>drop users element</button>
    </div>
  );
};

const Users = () => {
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  useEffect(() => {
    console.log("this is /users");
  }, []);
  return (
    <>
      <p> Users </p>
      <Link to="/me">Me</Link>
      <div>
        <input style={{ background: "yellow" }} />
      </div>
      <button onClick={() => dropByCacheKey("/users")}>drop users element</button>
    </>
  );
};

const Me = () => {
  useEffect(() => {
    console.log("this is /me");
  }, []);
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  return (
    <>
      <p> Me </p> <Link to="/">go Home</Link>
      <div>
        <input style={{ background: "yellow" }} />
      </div>
      <button onClick={() => dropByCacheKey("/users")}>drop users element</button>
    </>
  );
};

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
