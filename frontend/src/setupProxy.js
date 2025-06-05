const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000/api';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
    })
  );
};
