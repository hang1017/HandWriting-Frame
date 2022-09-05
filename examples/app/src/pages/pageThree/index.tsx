import React from "react";
import type { FC } from "react";
import { Button } from "antd-mobile";
import { useNavigate } from "react-router-dom";

interface HangPageProps {}

const HangPage: FC<HangPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>Hello three</div>
      <Button onClick={() => navigate("/pageOne")}>to one</Button>
    </div>
  );
};

export default HangPage;
