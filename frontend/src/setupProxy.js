const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  console.log("Setting up proxy...")
  app.use(
    "/api/v1",
    createProxyMiddleware({
      target: "https://socialmedia-aap.onrender.com",
      changeOrigin: true,
    })
  )
}
