const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.promises.mkdir(destPath, { recursive: true });

    const files = await fs.promises.readdir(srcPath);

    for (const file of files) {
      const srcFile = path.join(srcPath, file);
      const destFile = path.join(destPath, file);
      const stat = await fs.promises.stat(srcFile);
      if (stat.isDirectory()) {
        await copyDir(srcFile, destFile);
      } else {
        const readStream = fs.createReadStream(srcFile);
        const writeStream = fs.createWriteStream(destFile);
        readStream.pipe(writeStream);
      }
    }
    console.log('Копирование завершено!');
  } catch (err) {
    console.error(err);
  }
}

copyDir();