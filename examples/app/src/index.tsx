import React from "react";
import ReactDOM from "react-dom/client";

const Hello = () => {
  const [text, setText] = React.useState("Hi~, click me4");
  return <div onClick={() => setText("Malita")}>{text}</div>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Hello));
