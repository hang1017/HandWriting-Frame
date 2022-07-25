const getSocketHost = () => {
  console.log({ location });

  return `ws://${location.host}`;
};

if ("WebSocket" in window) {
  const ws = new WebSocket(getSocketHost());
  ws.addEventListener("message", (props) => {
    console.log({ props });
  });
}
