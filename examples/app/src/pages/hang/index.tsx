import React from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd-mobile";

interface HangPageProps {}

const HangPage: FC<HangPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>Hello Arose</div>
      <Button onClick={() => navigate("/hang/hangOne")}>to hangOne</Button>
    </div>
  );
};

export default HangPage;
