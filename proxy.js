const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create the proxy app
const app = express();
const PORT = 5000;

// Log requests
app.use((req, res, next) => {
  console.log(`Proxy: ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Redirect root to the backend server
app.get('/', (req, res) => {
  console.log('Redirecting root request to backend server');
  res.redirect('http://localhost:3000');
});

// Set up proxy for all other requests to backend server
app.use('*', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'debug'
}));

// Start the proxy server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log('Redirecting requests to backend server at http://localhost:3000');
});