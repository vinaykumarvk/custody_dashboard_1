const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to wait for a specific time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Build the React application first to ensure bundle.js exists
async function buildApp() {
  console.log('Building React application...');
  try {
    // Ensure the public directory exists
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Run webpack to build the bundle
    execSync('npx webpack --mode development', { stdio: 'inherit' });
    console.log('Build completed successfully');
    return true;
  } catch (error) {
    console.error('Build failed:', error);
    return false;
  }
}

// Start the servers with a delay to ensure API is ready before front-end
async function startServers() {
  // Build the application first
  const buildSuccess = await buildApp();
  if (!buildSuccess) {
    console.error('Failed to build application, exiting');
    process.exit(1);
  }
  
  console.log('Starting API server...');
  
  // Start Express API server - use PORT instead of SERVER_PORT to match server.js
  const apiServer = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000' }
  });
  
  // Wait for API server to initialize properly
  await wait(2000);
  
  console.log('Starting frontend server...');
  
  // Start the React frontend
  const webpackServer = spawn('npx', ['webpack', 'serve', '--mode', 'development', '--host', '0.0.0.0', '--port', '5000', '--hot'], {
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
}

// Start the servers
startServers();