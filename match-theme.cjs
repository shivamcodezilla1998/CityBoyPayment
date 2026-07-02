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
  { regex: /info-50\b/g, replacement: 'brand-50' },
  { regex: /info-100\b/g, replacement: 'brand-100' },
  { regex: /info-200\b/g, replacement: 'brand-200' },
  { regex: /info-500\b/g, replacement: 'brand-500' },
  { regex: /info-600\b/g, replacement: 'brand-600' },
  { regex: /info-700\b/g, replacement: 'brand-700' },
  { regex: /['"]#2563EB['"]/gi, replacement: "'#4C5BE0'" },
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
      console.log(`Matched theme color in ${filePath}`);
    }
  }
});
