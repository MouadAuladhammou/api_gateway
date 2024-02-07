const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

// initialises Sentry
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "https://ceea6eef768bf7368defd8c03169437a@o4505165383008256.ingest.sentry.io/4506593911898112",
});

try {
  const preFetch = (req, res, next) => {
    if (req.headers.authorization) console.log("authorization exists");
    else console.log("authorization does not exist");
    next();
  };

  // Middleware de gestion des erreurs
  const errorHandler = (err, req, res, next) => {
    Sentry.captureException("Proxy Error .. " + err);
    res.status(500).end();
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
      onError: errorHandler,
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
} catch (e) {
  Sentry.captureException(e);
}

const PORT = 8000;
app.listen(PORT, () => console.log("API GATEWAY STARTED ON PORT 8000"));
