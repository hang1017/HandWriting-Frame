import type { Server } from "http";
import { WebSocketServer } from "ws";

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({
    noServer: true,
  });

  server.on("upgrade", function upgrade(request, socket, head) {
    if (request.headers["sec-websocket-protocol"] === "malita-hmr") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });

  wss.on("error", (e: Error & { code: string }) => {
    if (e.code !== "EADDRINUSE") {
      console.error(`WebSocket server error:\n${e.stack || e.message}`);
    }
  });

  return {
    wss,
    send: (message: string) => {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
    },
    close: () => {
      wss.close();
    },
  };
}
