const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const preFetch = (req, res, next) => {
  if (req.headers.authorization) console.log("authorization exists");
  else console.log("authorization does not exist");
  next();
};

// NB Important: L'ordre des routes dans Express est important

// SERVICE EMAILS
app.use(
  "/emails",
  preFetch,
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
    pathRewrite: {
      "^/api/": "/",
    },
  })
);

// APP TRACKER GPS
app.use(
  "/",
  preFetch,
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
  })
);

const PORT = 8000;
app.listen(PORT, () => console.log("API GATEWAY STARTED"));
