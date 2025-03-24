const fs = require('fs');
const path = require('path');

// Create uploads directory structure
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const resumesDir = path.join(uploadsDir, 'resumes');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Create .gitkeep files to ensure empty directories are tracked
fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '');
fs.writeFileSync(path.join(resumesDir, '.gitkeep'), '');

console.log('Upload directories created successfully!'); 