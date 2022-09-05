import React from "react";
import type { FC } from "react";
import { Button } from "antd-mobile";
import { useNavigate } from "react-router-dom";

interface HangPageProps {}

const HangPage: FC<HangPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>Hello One</div>
      <Button onClick={() => navigate("/pageTwo")}>to Two</Button>
    </div>
  );
};

export default HangPage;
