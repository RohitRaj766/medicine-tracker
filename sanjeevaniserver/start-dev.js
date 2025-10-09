const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Sanjeevani Server...');
console.log('📁 Working directory:', process.cwd());

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating from env.example...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update the DATABASE_URL and JWT_SECRET.');
  } else {
    console.log('❌ env.example file not found. Please create a .env file manually.');
    process.exit(1);
  }
}

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
