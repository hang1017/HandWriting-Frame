import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { KeepAliveContext } from "@malitajs/keepalive";

const Users = () => {
  const { dropByCacheKey } = useContext<any>(KeepAliveContext);
  return (
    <>
      <p> Users </p>
      <Link to="/me">Me</Link>
      <button onClick={() => dropByCacheKey("/")}>dropByCacheKey ： /</button>
      <input style={{ width: "300px", background: "yellow" }} />
    </>
  );
};

export default Users;
