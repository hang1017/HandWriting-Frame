import type { Server } from "http";
import { WebSocketServer } from "ws";

export const createSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", function upgrade(request, socket, head) {
    if (request.headers["sec-websocket-protocol"] === "malita_hmr") {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", function connection(ws) {
    ws.send(JSON.stringify({ type: "connected" }));
  });

  return {
    wss,
    send: ({ type }: { type: string }) => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type }));
        }
      });
    },
  };
};
