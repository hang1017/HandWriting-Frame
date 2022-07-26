import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  return (
    <div>
      User
      <div>
        <button onClick={() => navigate("/me")}>to /me</button>
      </div>
    </div>
  );
};
const Me = () => {
  const navigate = useNavigate();
  return (
    <div>
      User
      <div>
        <button onClick={() => navigate("/")}>to /home</button>
      </div>
    </div>
  );
};
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      home
      <div>
        <button onClick={() => navigate("/user")}>to /user</button>
      </div>
    </div>
  );
};

const Hello = () => {
  const [text, setText] = React.useState("Hi~, click me1231");
  return (
    <div>
      <div onClick={() => setText("Malita")}>{text}</div>

      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/me" element={<Me />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Hello));
