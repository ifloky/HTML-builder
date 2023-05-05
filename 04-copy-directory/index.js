
const fs = require('fs');
const path = require('path');

async function copyDir() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');
  try {
    const dirExists = await fs.promises.stat(destDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.mkdir(destDir, { recursive: true });
    } else {
      console.error(error);
    }
  }
  const files = await fs.promises.readdir(srcDir, { withFileTypes: true });
  await Promise.all(
    files.map(async (file) => {
      const srcPath = path.join(srcDir, file.name);
      const destPath = path.join(destDir, file.name);
      if (file.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      } else if (file.isDirectory()) {
        await copyDirRecursive(srcPath, destPath);
      }
    })
  );
}

async function copyDirRecursive(srcDir, destDir) {
  try {
    const dirExists = await fs.promises.stat(destDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.mkdir(destDir, { recursive: true });
    } else {
      console.error(error);
    }
  }
  const files = await fs.promises.readdir(srcDir, { withFileTypes: true });
  await Promise.all(
    files.map(async (file) => {
      const srcPath = path.join(srcDir, file.name);
      const destPath = path.join(destDir, file.name);
      if (file.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      } else if (file.isDirectory()) {
        await copyDirRecursive(srcPath, destPath);
      }
    })
  );
}

copyDir();