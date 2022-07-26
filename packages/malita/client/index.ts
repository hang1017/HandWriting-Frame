const getSocketHost = () => {
  return `ws://${location.host}`;
};

if ("WebSocket" in window) {
  const ws = new WebSocket(getSocketHost(), "malita-hmr");
  let pingTimer: NodeJS.Timer | null = null;
  ws.addEventListener("message", (props) => {
    const { data = "{}" } = props;
    const res = JSON.parse(data);
    const { type = "" } = res;
    if (type === "connected") {
      console.log("【malita】connected");
      pingTimer = setInterval(() => ws.send("ping"), 3000);
    }
    if (type === "reload") window.location.reload();
  });

  const waitForSuccessfulPing = async (ms = 1000) => {
    while (true) {
      try {
        await fetch("__malita_ping");
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
    }
  };

  ws.addEventListener("close", async (props) => {
    if (pingTimer) clearInterval(pingTimer);
    console.info("[malita] Dev server disconnected. Polling for restart...");
    await waitForSuccessfulPing();
    window.location.reload();
  });
}
