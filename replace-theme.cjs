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
  { regex: /bg-emerald-/g, replacement: 'bg-brand-' },
  { regex: /text-emerald-/g, replacement: 'text-brand-' },
  { regex: /border-emerald-/g, replacement: 'border-brand-' },
  { regex: /ring-emerald-/g, replacement: 'ring-brand-' },
  { regex: /from-emerald-/g, replacement: 'from-brand-' },
  { regex: /to-emerald-/g, replacement: 'to-brand-' },
  
  { regex: /bg-slate-50\b/g, replacement: 'bg-subtle' },
  { regex: /bg-slate-100\b/g, replacement: 'bg-subtle' },
  { regex: /bg-slate-800\b/g, replacement: 'bg-surface' },
  { regex: /bg-slate-900\b/g, replacement: 'bg-canvas' },
  
  { regex: /text-slate-400\b/g, replacement: 'text-tertiary' },
  { regex: /text-slate-500\b/g, replacement: 'text-secondary' },
  { regex: /text-slate-600\b/g, replacement: 'text-secondary' },
  { regex: /text-slate-700\b/g, replacement: 'text-primary' },
  { regex: /text-slate-800\b/g, replacement: 'text-primary' },
  { regex: /text-slate-900\b/g, replacement: 'text-primary' },

  { regex: /border-slate-100\b/g, replacement: 'border-soft' },
  { regex: /border-slate-200\b/g, replacement: 'border-soft' },
  { regex: /border-slate-300\b/g, replacement: 'border-strong' },
  
  // Custom replacements for blue/indigo if they exist
  { regex: /bg-blue-600\b/g, replacement: 'bg-brand-600' },
  { regex: /bg-blue-500\b/g, replacement: 'bg-brand-500' },
  { regex: /text-blue-600\b/g, replacement: 'text-brand-600' },
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
      console.log(`Updated ${filePath}`);
    }
  }
});
