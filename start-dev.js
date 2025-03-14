const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to wait for a specific time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Run database setup (migration + seeding)
async function setupDatabase() {
  console.log('Setting up database...');
  try {
    // Run our db-setup.js script
    await new Promise((resolve, reject) => {
      const dbSetup = spawn('node', ['db-setup.js'], {
        stdio: 'inherit'
      });
      
      dbSetup.on('exit', (code) => {
        if (code === 0) {
          console.log('Database setup completed successfully');
          resolve();
        } else {
          console.error(`Database setup failed with code ${code}`);
          reject(new Error(`Database setup failed with code ${code}`));
        }
      });
    });
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  }
}

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

// Start both the backend API server and frontend server
async function startServers() {
  // Set up the database
  const dbSetupSuccess = await setupDatabase();
  if (!dbSetupSuccess) {
    console.error('Failed to set up database, proceeding with caution');
    // We'll continue even if DB setup fails, as the API might work with existing DB
  }
  
  // Build the application first
  const buildSuccess = await buildApp();
  if (!buildSuccess) {
    console.error('Failed to build application, exiting');
    process.exit(1);
  }
  
  console.log('Starting servers...');
  
  // Start the Express backend API server
  const apiServer = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development', PORT: '3000' }
  });
  
  // Wait a bit for the API server to start
  await wait(2000);
  
  // Start the React frontend with proxy to the API
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
  console.log('- Frontend running on port 5000 (with API proxy)');
}

// Start the servers
startServers();