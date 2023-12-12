const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  console.log("Setting up proxy...")
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: "http://localhost:4000",
      changeOrigin: true,
    })
  )
}
