//@markdown-to-script-format.md


import { createReadStream, writeFile } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const readMarkdownFile = async (filePath) => {
  console.log('Reading', filePath);
  const fileStream = createReadStream(filePath);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isCodeBlock = false;
  let fileName = '';
  let fileContent = [];

  for await (const line of rl) {
    if (line.startsWith('@')) {
      fileName = line.substring(1).trim(); // Extract file name
    } else if (line.startsWith('```')) {
      isCodeBlock = !isCodeBlock; // Detect start/end of code block
      if (!isCodeBlock && fileName) {
        await saveScript(fileName, fileContent.join('\n')); // End of code block -- save file
        fileName = ''; // Reset for next file
        fileContent = [];
      }
    } else if (isCodeBlock) {
      fileContent.push(line); // Collect content when inside a code block
    }
  }
};


const saveScript = (fileName, content) => {
  console.log('saving', fileName);
  return new Promise((resolve, reject) => {
    const filePath = join(__dirname, fileName);
    writeFile(filePath, content, { flag: 'w' }, (err) => { // Overwrite if exists
      if (err) {
        console.error(`Error saving file ${fileName}:`, err);
        reject(err);
      } else {
        console.log(`File saved: ${fileName}`);
        resolve();
      }
    });
  });
};

const run = async () => {
  const markdownPath = join(__dirname, process.argv[2] || 'example.md');
  await readMarkdownFile(markdownPath).catch(console.error);
};


// ES6 way to check if the script is run directly

const isMain = import.meta.url === process.argv[1];
console.log(isMain);
if (isMain) {
  console.log('command line detected, running')
  run();
}

export { readMarkdownFile };