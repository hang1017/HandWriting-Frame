export default {
  title: "Hello",
  keepalive: [/./, "/users"],
  mainPath: "/pageOne/",
  proxy: {
    "/api": {
      target: "http://jsonplaceholder.typicode.com/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
};
