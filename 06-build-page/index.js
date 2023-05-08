const fs = require('fs');
const path = require('path');

const distDir = './06-build-page/project-dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const templateFile = path.join(__dirname, 'template.html');
const template = fs.readFileSync(templateFile, 'utf-8');

const regex = /{{(.+?)}}/g;
const tags = template.match(regex);

let html = template;
tags.forEach(tag => {
  const componentName = tag.slice(2, -2).trim()+".html";
  if (!componentName.endsWith('.html')) {
    throw new Error(`Component file type not allowed for ${componentName}`);
  }
  const componentPath = path.join(__dirname, 'components', componentName);
  const componentContent = fs.readFileSync(componentPath, 'utf-8');
  html = html.replace(tag, componentContent);
});

const indexFile = path.join(distDir, 'index.html');
fs.writeFileSync(indexFile, html);

const stylePath = path.join(__dirname, 'styles');
const styleFile = path.join(distDir, 'style.css');
let styleContent = '';
fs.readdirSync(stylePath).forEach(file => {
  if (file.endsWith('.css')) {
    const filePath = path.join(stylePath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    styleContent += fileContent;
  } else {
    console.warn(`File type not allowed for style ${file}`);
  }
});
fs.writeFileSync(styleFile, styleContent);

const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(distDir, 'assets');
const copyRecursiveSync = (src, dest) => {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  entries.forEach(entry => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      if (entry.name.endsWith('.html')) {
        console.warn(`File type not allowed for asset ${entry.name}`);
        return;
      }
      fs.copyFileSync(srcPath, destPath);
    }
  });
};
copyRecursiveSync(assetsPath, assetsDistPath);

console.log('Page successfully built!');
