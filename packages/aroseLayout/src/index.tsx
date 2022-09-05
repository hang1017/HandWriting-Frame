import React from "react";
import type { FC } from "react";
import { useOutlet } from "react-router-dom";

export interface AroseLayoutProps {
  children?: any;
}

const AroseLayout: FC<AroseLayoutProps> = (props) => {
  const { children } = props;
  const outlet = useOutlet();
  return (
    <div>
      <div>AroseLayout</div>
      <div>{children}</div>
      <div>{outlet}</div>
    </div>
  );
};

export default AroseLayout;
