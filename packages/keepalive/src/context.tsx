import { createContext } from "react";

export interface KeepAliveContextProps {
  keepalive: (string | RegExp)[];
  keepElements: { current: Record<string, any> };
  dropByCacheKey?: (path: string) => void;
}

export const KeepAliveContext = createContext<KeepAliveContextProps>({
  keepalive: [],
  keepElements: { current: {} },
});
