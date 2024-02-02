const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const preFetch = (req, res, next) => {
  if (req.headers.authorization) console.log("authorization exists");
  else console.log("authorization does not exist");
  next();
};

// NB Important: L'ordre des routes dans Express est pris en compte

// APP TRACKER GPS
app.use(
  "/v1",
  preFetch,
  createProxyMiddleware({
    target: "http://localhost:5001",
    changeOrigin: true,
    pathRewrite: {
      "^/v1": "", // Retirer le préfixe /v1 de l'URL
    },
  })
);

// SERVICE EMAILS
app.use(
  "/emails/api",
  preFetch,
  createProxyMiddleware({
    target: "http://localhost:5003",
    changeOrigin: true,
  })
);

const PORT = 8000;
app.listen(PORT, () => console.log("API GATEWAY STARTED ON PORT 8000"));
