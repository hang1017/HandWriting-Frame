import React, { useEffect, useContext } from "react";
import { KeepAliveContext } from "@malitajs/keepalive";
import { Link } from "react-router-dom";

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

export default Me;
