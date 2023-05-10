const fs = require('fs').promises;
const path = require('path');

const distDir = './06-build-page/project-dist';

fs.stat(distDir)
  .catch(() => {
    return fs.mkdir(distDir);
  })
  .then(() => {
    const templateFile = path.join(__dirname, 'template.html');
    return fs.readFile(templateFile, 'utf-8');
  })
  .then(template => {
    const regex = /{{(.+?)}}/g;
    const tags = template.match(regex);

    let html = template;
    return Promise.all(tags.map(tag => {
      const componentName = tag.slice(2, -2).trim() + ".html";
      if (!componentName.endsWith('.html')) {
        throw new Error(`Component file type not allowed for ${componentName}`);
      }
      const componentPath = path.join(__dirname, 'components', componentName);
      return fs.readFile(componentPath, 'utf-8')
        .then(componentContent => {
          html = html.replace(tag, componentContent);
        });
    })).then(() => {
      return html;
    });
  })
  .then(html => {
    const indexFile = path.join(distDir, 'index.html');
    return fs.writeFile(indexFile, html);
  })
  .then(() => {
    const stylePath = path.join(__dirname, 'styles');
    const styleFile = path.join(distDir, 'style.css');
    let styleContent = '';
    return fs.readdir(stylePath)
      .then(files => {
        return Promise.all(files.map(file => {
          if (file.endsWith('.css')) {
            const filePath = path.join(stylePath, file);
            return fs.readFile(filePath, 'utf-8')
              .then(fileContent => {
                styleContent += fileContent;
              });
          } else {
            console.warn(`File type not allowed for style ${file}`);
            return Promise.resolve();
          }
        })).then(() => {
          return fs.writeFile(styleFile, styleContent);
        });
      });
  })
  .then(() => {
    const assetsPath = path.join(__dirname, 'assets');
    const assetsDistPath = path.join(distDir, 'assets');
    const copyRecursiveSync = async (src, dest) => {
      try {
        const entries = await fs.readdir(src, { withFileTypes: true });
        await fs.mkdir(dest);
        await Promise.all(entries.map(async entry => {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            await copyRecursiveSync(srcPath, destPath);
          } else {
            if (entry.name.endsWith('.html')) {
              console.warn(`File type not allowed for asset ${entry.name}`);
              return;
            }
            await fs.copyFile(srcPath, destPath);
          }
        }));
      } catch (err) {
        console.error(err);
      }
    };
    return copyRecursiveSync(assetsPath, assetsDistPath);
  })
  .then(() => {
    console.log('Page successfully built!');
  })
  .catch(err => {
    console.error(err);
  });
