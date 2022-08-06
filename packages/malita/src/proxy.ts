import { ServerOptions } from "http-proxy";
import type { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export type ProxyProps = Record<string, ServerOptions>;

export const getProxy = async ({ proxy, app }: { proxy: ProxyProps; app: Express }) => {
  return new Promise((resolve: (res: boolean) => void, reject) => {
    try {
      if (proxy) {
        Object.entries(proxy).forEach(([key, obj]: [string, ServerOptions]) => {
          app.use(key, createProxyMiddleware(obj));
        });
      }
      resolve(true);
    } catch (e) {
      reject(false);
    }
  });
};
