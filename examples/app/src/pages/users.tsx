import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { KeepAliveContext } from "@malitajs/keepalive";

import "./users.css";

const Users = () => {
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  useEffect(() => {
    console.log("this is /users");
  }, []);
  return (
    <>
      <p className="users-style"> Users </p>
      <Link to="/me">Me</Link>
      <div>
        <input style={{ background: "yellow" }} />
      </div>
      <button onClick={() => dropByCacheKey("/users")}>drop users element</button>
    </>
  );
};

export default Users;
