import React from "react";
import { Link } from "react-router-dom";

const Me = () => {
  return (
    <>
      <p> Me </p> <Link to="/">go Home</Link>
      <input style={{ width: "300px", background: "yellow" }} />
    </>
  );
};

export default Me;
