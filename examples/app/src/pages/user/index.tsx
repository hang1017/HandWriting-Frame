import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const User = () => {
  const navigate = useNavigate();
  return (
    <div className="userStyle">
      User
      <div>
        <button onClick={() => navigate("/me")}>to /me</button>
      </div>
      <input style={{ width: "200px", background: "yellow" }} />
    </div>
  );
};

export default User;
