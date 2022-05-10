import { WebSocketServer } from "ws";
import { Server as HttpServer } from "http";

export function createWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({
    noServer: true,
  });

  server.on("upgrade", function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit("connection", ws, request);
    });
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
    send(message: string) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
    },
    close() {
      wss.close();
    },
    wss,
  };
}
