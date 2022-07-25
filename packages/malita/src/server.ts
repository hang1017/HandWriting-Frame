import type { Server } from "http";
import { WebSocketServer } from "ws";

export const createWsServer = (server: Server) => {
  const wss = new WebSocketServer({ server });
  console.log({ wss });

  server.on("upgrade", function upgrade(request, socket, head) {
    console.log("~~upgrade~~");

    wss.handleUpgrade(request, socket, head, function done(ws) {
      console.log("handleUpgrade");

      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });
    ws.send("something");
  });

  return {
    wss,
    send: (text: string) => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(text);
        }
      });
    },
  };
};
