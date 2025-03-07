const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

// Create the proxy app
const app = express();
const PORT = 5000;

// Log requests
app.use((req, res, next) => {
  console.log(`Proxy: ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Forward API requests to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'silent'
}));

// Serve static files directly from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch all other routes and serve index.html
app.get('*', (req, res) => {
  if (req.url === '/' || !path.extname(req.url)) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    // For any other file paths, check if they exist in public
    const filePath = path.join(__dirname, 'public', req.url);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      // If file doesn't exist, send index.html for client-side routing
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  }
});

// Start the proxy server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log('Serving frontend from public directory and proxying API requests to port 3000');
});