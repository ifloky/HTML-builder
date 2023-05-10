const fs = require('fs').promises;
const path = require('path');

const distDir = './06-build-page/project-dist';
const templateFile = path.join(__dirname, 'template.html');
const stylePath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(distDir, 'assets');

async function buildPage() {
  try {
    if (!await fs.access(distDir)) {
      await fs.mkdir(distDir);
    }

    const template = await fs.readFile(templateFile, 'utf-8');
    const regex = /{{(.+?)}}/g;
    const tags = template.match(regex);

    let html = template;
    for (const tag of tags) {
      const componentName = tag.slice(2, -2).trim() + ".html";
      if (!componentName.endsWith('.html')) {
        throw new Error(`Component file type not allowed for ${componentName}`);
      }
      const componentPath = path.join(__dirname, 'components', componentName);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      html = html.replace(tag, componentContent);
    }

    const indexFile = path.join(distDir, 'index.html');
    await fs.writeFile(indexFile, html);

    let styleContent = '';
    for (const file of await fs.readdir(stylePath)) {
      if (file.endsWith('.css')) {
        const filePath = path.join(stylePath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        styleContent += fileContent;
      } else {
        console.warn(`File type not allowed for style ${file}`);
      }
    }

    const styleFile = path.join(distDir, 'style.css');
    await fs.writeFile(styleFile, styleContent);

    if (!await fs.access(assetsDistPath)) {
      await fs.mkdir(assetsDistPath);
    }
    const copyRecursiveSync = async (src, dest) => {
      const entries = await fs.readdir(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          await copyRecursiveSync(srcPath, destPath);
        } else {
          if (entry.name.endsWith('.html')) {
            console.warn(`File type not allowed for asset ${entry.name}`);
            continue;
          }
          await fs.copyFile(srcPath, destPath);
        }
      }
    };
    await copyRecursiveSync(assetsPath, assetsDistPath);

    console.log('Page successfully built!');
  } catch (error) {
    console.error(error);
  }
}

buildPage();