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
  { regex: /bg-green-100\b/g, replacement: 'bg-success-50' },
  { regex: /text-green-700\b/g, replacement: 'text-success-500' },
  { regex: /bg-green-500\b/g, replacement: 'bg-success-500' },
  
  { regex: /text-blue-500\b/g, replacement: 'text-brand-500' },
  { regex: /text-blue-600\b/g, replacement: 'text-brand-600' },
  { regex: /bg-blue-100\b/g, replacement: 'bg-brand-100' },
  
  { regex: /text-amber-500\b/g, replacement: 'text-warning-500' },
  { regex: /bg-amber-100\b/g, replacement: 'bg-warning-50' },
  
  { regex: /text-red-500\b/g, replacement: 'text-danger-500' },
  { regex: /bg-red-100\b/g, replacement: 'bg-danger-50' },
  
  // ApexCharts HEX colors
  { regex: /['"]#10B981['"]/g, replacement: "'#14C8B8'" }, // emerald-500 -> accent-500
  { regex: /['"]#059669['"]/g, replacement: "'#4C5BE0'" }, // darker emerald -> brand-500
  { regex: /['"]#3B82F6['"]/g, replacement: "'#4C5BE0'" }, // blue-500 -> brand-500
  { regex: /['"]#F59E0B['"]/g, replacement: "'#F59E0B'" }, // amber-500 -> warning-500
  { regex: /['"]#EF4444['"]/g, replacement: "'#EF4444'" }, // red-500 -> danger-500
  
  // Hardcoded rgb values if any
  { regex: /bg-gray-50\b/g, replacement: 'bg-subtle' },
  { regex: /bg-gray-100\b/g, replacement: 'bg-subtle' },
  { regex: /bg-gray-800\b/g, replacement: 'bg-surface' },
  { regex: /bg-gray-900\b/g, replacement: 'bg-canvas' },
  { regex: /text-gray-400\b/g, replacement: 'text-tertiary' },
  { regex: /text-gray-500\b/g, replacement: 'text-secondary' },
  { regex: /text-gray-600\b/g, replacement: 'text-secondary' },
  { regex: /text-gray-700\b/g, replacement: 'text-primary' },
  { regex: /text-gray-800\b/g, replacement: 'text-primary' },
  { regex: /text-gray-900\b/g, replacement: 'text-primary' },
  { regex: /border-gray-100\b/g, replacement: 'border-soft' },
  { regex: /border-gray-200\b/g, replacement: 'border-soft' },
  { regex: /border-gray-300\b/g, replacement: 'border-strong' },
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
      console.log(`Updated colors in ${filePath}`);
    }
  }
});
