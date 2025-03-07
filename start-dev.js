const { spawn } = require('child_process');
const path = require('path');

// Start the API server
const apiServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env, SERVER_PORT: '3000' }
});

// Start the React frontend
const webpackServer = spawn('npx', ['webpack', 'serve', '--mode', 'development', '--host', '0.0.0.0', '--port', '5000', '--open', '--hot'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  apiServer.kill();
  webpackServer.kill();
  process.exit(0);
});

console.log('Development servers started:');
console.log('- API server running on port 3000');
console.log('- Frontend server running on port 5000');