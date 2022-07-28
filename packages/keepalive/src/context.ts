import { createContext } from "react";
import { KeepaliveContextProps } from "./types";

export const KeepaliveContext = createContext({
  keepalive: [],
  keepElements: {},
} as KeepaliveContextProps);
