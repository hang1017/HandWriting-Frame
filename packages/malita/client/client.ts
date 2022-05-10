if ("WebSocket" in window) {
  const socket = new window.WebSocket("ws://127.0.0.:8888");
  let pingTimer: NodeJS.Timer | null = null;
  socket.addEventListener("message", async ({ msg }: any) => {
    const data = JSON.parse(msg);
    if (data.type === "connected") {
      pingTimer = setInterval(() => socket.send("ping"), 30000);
    }
    if (data.type === "reload") window.location.reload();
  });

  async function waitForSuccessfulPing(ms = 1000) {
    while (true) {
      try {
        await fetch("/_malita_ping");
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
    }
  }

  socket.addEventListener("close", async () => {
    if (pingTimer) clearInterval(pingTimer);
    console.info("[malita] Dev server disconnected. Polling for restart...");
    await waitForSuccessfulPing();
    window.location.reload();
  });
}
