const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesDirPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const styles = cssFiles.map((file) =>
    fs.readFileSync(path.join(stylesDirPath, file)).toString()
  );

  fs.writeFileSync(bundleFilePath, styles.join('\n'));
  
  console.log(`File bundle.css has been successfully created in project-dist folder.`);
});