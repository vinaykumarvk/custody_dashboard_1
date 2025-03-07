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

// Start the frontend server only (assumes backend is already running)
async function startFrontend() {
  // Build the application first
  const buildSuccess = await buildApp();
  if (!buildSuccess) {
    console.error('Failed to build application, exiting');
    process.exit(1);
  }
  
  console.log('Starting frontend development environment...');
  
  // First, create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
  }
  
  console.log('Starting frontend server...');
  
  // Start the React frontend (use port 8080 instead of 5000 to avoid conflicts)
  const webpackServer = spawn('npx', ['webpack', 'serve', '--mode', 'development', '--host', '0.0.0.0', '--port', '8080', '--hot'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Handle frontend server errors
  webpackServer.on('error', (error) => {
    console.error('Error starting frontend server:', error);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down frontend server...');
    webpackServer.kill();
    process.exit(0);
  });
  
  webpackServer.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Frontend server exited with code ${code}`);
      process.exit(1);
    }
  });
  
  console.log('Frontend server running on http://localhost:8080');
}

// Start the frontend
startFrontend();