const fs = require('fs/promises');
const path = require('path');

async function main() {
  try {
    const files = await fs.readdir('03-files-in-folder/secret-folder', { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const extension = path.extname(file.name).slice(1);
        const size = (await fs.stat(`03-files-in-folder/secret-folder/${file.name}`)).size;
        console.log(`${file.name}-${extension}-${(size / 1024).toFixed(3)}kb`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

main();