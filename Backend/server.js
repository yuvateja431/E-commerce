const { spawn } = require('child_process');

console.log("Starting development server via wrapper...");
const child = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit', 
  shell: true 
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
});
