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
      <div>this is /hangOne</div>
      <Button onClick={() => navigate(-1)}>back to hang</Button>
    </div>
  );
};

export default HangPage;
