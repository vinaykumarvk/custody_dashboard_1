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

// Start only the frontend server since we're using mock data
async function startServers() {
  // Build the application first
  const buildSuccess = await buildApp();
  if (!buildSuccess) {
    console.error('Failed to build application, exiting');
    process.exit(1);
  }
  
  console.log('Starting frontend server with mock data...');
  
  // Start the React frontend
  const webpackServer = spawn('npx', ['webpack', 'serve', '--mode', 'development', '--host', '0.0.0.0', '--port', '5000', '--hot'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down server...');
    webpackServer.kill();
    process.exit(0);
  });
  
  console.log('Development server started:');
  console.log('- Frontend running on port 5000 (using mock data)');
}

// Start the servers
startServers();