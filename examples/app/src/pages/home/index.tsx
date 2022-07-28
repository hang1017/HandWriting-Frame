import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      home
      <div>
        <button onClick={() => navigate("/user")}>to /user</button>
      </div>
      <input style={{ width: "200px", background: "yellow" }} />
    </div>
  );
};

export default Home;
