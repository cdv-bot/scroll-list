const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dummyjson.com/products?limit=10&skip=1&select=title,price',
      changeOrigin: true,
    })
  );
};