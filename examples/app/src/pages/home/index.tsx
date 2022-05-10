import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

const Hello = () => {
  const [text, setText] = React.useState("Hello Malita!");
  const [count, setCount] = useState(0);
  return (
    <>
      <p
        className="malita-home"
        onClick={() => {
          setText("Hi!");
        }}
      >
        {text}
      </p>
      <p>{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}> Click Me! Add!</button>
      </p>
      <Link to="/users">go to Users</Link>
    </>
  );
};

export default Hello;
