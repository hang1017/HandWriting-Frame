import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { KeepAliveContext } from "@malitajs/keepalive";

import "./home.css";

const Hello = () => {
  const [text, setText] = useState<string>("hi");
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  useEffect(() => {
    console.log("this is /");
  }, []);

  return (
    <div>
      <div className="home-style" onClick={() => setText("hi aaaa")}>
        {text}
      </div>
      <Link to="/users">to User click</Link>
      <div>
        <input style={{ background: "yellow" }} />
      </div>
      <button onClick={() => dropByCacheKey("/users")}>drop users element</button>
    </div>
  );
};

export default Hello;
