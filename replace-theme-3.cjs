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
  { regex: /['"]#10b981['"]/gi, replacement: "'#14C8B8'" }, 
  { regex: /text-green-600/g, replacement: "text-success-500" },
  { regex: /border-t-emerald-600/g, replacement: "border-t-brand-600" },
  { regex: /bg-green-500/g, replacement: "bg-success-500" },
  { regex: /bg-emerald-500/g, replacement: "bg-brand-500" },
  { regex: /text-emerald-500/g, replacement: "text-brand-500" },
  { regex: /['"]#059669['"]/gi, replacement: "'#4C5BE0'" },
  { regex: /bg-emerald-600/g, replacement: "bg-brand-600" },
  { regex: /bg-emerald-100/g, replacement: "bg-brand-100" },
  { regex: /text-emerald-700/g, replacement: "text-brand-700" },
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
      console.log(`Removed green in ${filePath}`);
    }
  }
});
