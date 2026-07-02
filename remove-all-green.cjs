const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  // Replace success (green) with info (blue)
  { regex: /success-50\b/g, replacement: 'info-50' },
  { regex: /success-100\b/g, replacement: 'info-100' },
  { regex: /success-500\b/g, replacement: 'info-500' },
  { regex: /success-600\b/g, replacement: 'info-500' }, // fallback
  { regex: /success-700\b/g, replacement: 'info-500' }, // fallback
  
  // Also replace teal/accent because it looks green/cyan
  { regex: /accent-50\b/g, replacement: 'info-50' },
  { regex: /accent-500\b/g, replacement: 'info-500' },
  { regex: /['"]#14C8B8['"]/gi, replacement: "'#2563EB'" }, // Teal -> Blue

  // Just in case any hardcoded greens snuck in via my script
  { regex: /['"]#16a34a['"]/gi, replacement: "'#2563EB'" },
];

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    replacements.forEach(({ regex, replacement }) => {
      newContent = newContent.replace(regex, replacement);
    });
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Removed success/teal from ${filePath}`);
    }
  }
});
