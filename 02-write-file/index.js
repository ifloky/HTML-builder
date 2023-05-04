const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeStream = fs.createWriteStream('02-write-file/output.txt');

console.log('Введите текст для записи в файл (введите "exit" для завершения)');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Завершение работы программы...');
    rl.close();
  } else {
    writeStream.write(input + '\n');
    console.log(`Текст "${input}" записан в файл.`);
  }
});

rl.on('close', () => {
  console.log('Работа программы завершена.');
});