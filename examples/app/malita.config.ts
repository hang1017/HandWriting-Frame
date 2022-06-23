export default {
  keepalive: ["/users"],
  title: "malita Demo1111",
  proxy: {
    "/api": {
      target: "http://jsonplaceholder.typicode.com/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
};
