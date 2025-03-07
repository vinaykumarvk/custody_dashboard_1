const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building the React application...');

// Ensure the public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

try {
  // Run webpack to build production bundle
  execSync('npx webpack --mode production', { stdio: 'inherit' });
  console.log('Build completed successfully. Files are in the public directory.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}