function getSocketHost() {
  const url: any = location;
  const host = url.host;
  const isHttps = url.protocol === "https:";
  return `${isHttps ? "wss" : "ws"}://${host}`;
}

if ("WebSocket" in window) {
  const ws = new WebSocket(getSocketHost(), "malita_hmr");
  let pingTimer: NodeJS.Timer | null = null;
  ws.addEventListener("message", ({ data = "{}" }) => {
    const reqData = JSON.parse(data || "{}");
    const { type } = reqData;
    if (type === "connected") {
      console.log("【malita】connected");
      pingTimer = setInterval(() => ws.send("ping"), 30000);
    }
    if (type === "reload") window.location.reload();
  });

  const waitForSuccessfulPing = async (ms = 10) => {
    while (true) {
      try {
        fetch("__malita_ping");
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
    }
  };

  ws.addEventListener("close", async () => {
    if (pingTimer) clearInterval(pingTimer);
    console.log("[malita] Dev server disconnected. Polling for restart...");
    await waitForSuccessfulPing();
    location.reload();
  });
}
