import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { KeepaliveContext } from "@malitajs/keepalive";

const Me = () => {
  const navigate = useNavigate();
  const { dorpByCacheKey } = useContext(KeepaliveContext);
  return (
    <div>
      User
      <div>
        <button onClick={() => navigate("/")}>to /home</button>
      </div>
      <input style={{ width: "200px", background: "yellow" }} />
      <div>
        <button onClick={() => dorpByCacheKey("/user")}>drop user</button>
      </div>
    </div>
  );
};

export default Me;
