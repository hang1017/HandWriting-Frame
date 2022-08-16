import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Aaa = () => {
  const navigate = useNavigate();
  return (
    <div className="aaaStyle">
      <div>this is aaa</div>
      <input style={ width: "200px", background: "yellow" } />
    </div>
  );
};

export default Aaa;
