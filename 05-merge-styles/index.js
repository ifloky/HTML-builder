const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');
const projectDistPath = path.join(__dirname, 'project-dist');

if (!fs.existsSync(projectDistPath)) {
  fs.mkdir(projectDistPath, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

fs.readdir(stylesDirPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const styles = [];

  cssFiles.forEach((file, index) => {
    fs.readFile(path.join(stylesDirPath, file), (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      styles[index] = data.toString();

      if (index === cssFiles.length - 1) {
        fs.writeFile(bundleFilePath, styles.join('\n'), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`File bundle.css has been successfully created in project-dist folder.`);
        });
      }
    });
  });
});
