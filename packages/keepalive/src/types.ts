export interface KeepaliveContextProps {
  keepElements: any;
  keepalive: (string | RegExp)[];
  dorpByCacheKey: (path: string) => void;
}
