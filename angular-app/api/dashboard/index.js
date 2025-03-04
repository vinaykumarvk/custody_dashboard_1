// This file serves as a proxy to redirect requests to index.json
module.exports = function(req, res) {
  // Set headers
  res.setHeader('Content-Type', 'application/json');
  
  // Redirect to index.json
  res.sendFile(__dirname + '/index.json');
};