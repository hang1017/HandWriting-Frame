module.exports = {
  title: "malita Hello12",
  keepalive: ["/users"],
  proxy: {
    "/api": {
      target: "http://jsonplaceholder.typicode.com/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
};
