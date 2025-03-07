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
  
  console.log('Starting development environment...');
  
  // First, create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
  }
  
  // Check if database tables exist and create if needed
  try {
    // This runs the server script to initialize the database
    console.log('Checking database schema...');
    const initProcess = spawn('node', ['server.js', '--init-db-only'], {
      stdio: 'inherit',
      env: { ...process.env, INIT_DB_ONLY: 'true', PORT: '0' }
    });
    
    // Wait for initialization to complete
    await new Promise((resolve) => {
      initProcess.on('exit', (code) => {
        if (code === 0) {
          console.log('Database initialization completed');
        } else {
          console.warn('Database initialization completed with warnings');
        }
        resolve();
      });
    });
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
  
  console.log('Starting API server...');
  
  // Start Express API server - use PORT instead of SERVER_PORT to match server.js
  const apiServer = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000' }
  });
  
  // Handle API server errors
  apiServer.on('error', (error) => {
    console.error('Error starting API server:', error);
  });
  
  // Wait for API server to initialize properly (doubled wait time)
  console.log('Waiting for API server to initialize...');
  await wait(4000);
  
  console.log('Starting frontend server...');
  
  // Start the React frontend
  const webpackServer = spawn('npx', ['webpack', 'serve', '--mode', 'development', '--host', '0.0.0.0', '--port', '5000', '--hot'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Handle frontend server errors
  webpackServer.on('error', (error) => {
    console.error('Error starting frontend server:', error);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down servers...');
    apiServer.kill();
    webpackServer.kill();
    process.exit(0);
  });
  
  // Handle unexpected termination
  apiServer.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`API server exited with code ${code}`);
      console.log('Shutting down all servers...');
      webpackServer.kill();
      process.exit(1);
    }
  });
  
  webpackServer.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Frontend server exited with code ${code}`);
      console.log('Shutting down all servers...');
      apiServer.kill();
      process.exit(1);
    }
  });
  
  console.log('Development servers started:');
  console.log('- API server running on http://localhost:3000');
  console.log('- Frontend server running on http://localhost:5000');
}

// Start the servers
startServers();