import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const Hello = () => {
  const [text, setText] = useState<string>("hi");

  return <div onClick={() => setText("hi aaaa")}>{text}</div>;
};

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("malita"));
root.render(React.createElement(Hello));
