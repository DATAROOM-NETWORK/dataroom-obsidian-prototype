---
lastIndexed: never
lastUpdated: 2024-03-18T08:31:33.000Z
file-id: add-uuids
tags:
  - ai-training-data
  - prompt
type: prompt
latitude: 33.736061
longitude: -118.2922
ai-training-data: true
ai-training-weight: 1
prompt: null
uuid: 05f33e20-a9d1-443b-a91c-80e8d822d6fe
---
You are ![[personality]]
We are writing a ![[node.js-script]]
It should use ![[find-markdown-files]] and ![[read-markdown-file]] as well as ![[write-markdown-file]]

It should step through folder and find every file that does not have a UUID in the YAML Frontmatter. It should add a UUID to the YAML Frontmatter if the file does not have a UUID and save the file. Please generate the UUID using the crypto api.


Below is a Node.js script that walks through a directory, finds Markdown files, checks if they have a UUID in their YAML frontmatter, and if they do not, it adds a UUID using the crypto API and saves the file. This script uses the `fs`, `path`, `crypto`, and `gray-matter` libraries. The `gray-matter` library is used for parsing and injecting the YAML frontmatter in Markdown files.


Before running the script, you need to install `gray-matter`:


```bash

npm install gray-matter

```


Here is the script:


```javascript

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');


// Function to recursively find markdown files

function findMarkdownFiles(dir, filesFound = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, filesFound); // Recursion for directories
    } else if (filePath.endsWith('.md')) {
      filesFound.push(filePath); // Accumulate Markdown files
    }
  });
  return filesFound;
}


// Function to generate a UUID

function generateUUID() {
  return crypto.randomUUID();
}


// Function to add UUID to YAML frontmatter

function addUuidToMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsedContent = matter(fileContent);
  if (!parsedContent.data.uuid) {
    parsedContent.data.uuid = generateUUID(); // Add UUID
    const newContent = matter.stringify(parsedContent.content, parsedContent.data);
    fs.writeFileSync(filePath, newContent);
    console.log(`UUID added to ${filePath}`);
  } else {
    console.log(`UUID already exists in ${filePath}`);
  }
}

// Main function to process files in a given folder

function processFilesInFolder(folderPath) {
  const markdownFiles = findMarkdownFiles(folderPath);
  markdownFiles.forEach(filePath => {
    addUuidToMarkdownFile(filePath);
  });
}


// Replace './your-folder-path' with the path to the folder you want to process

const folderPath = '..';
processFilesInFolder(folderPath);

```


Ensure you:


- Replace `'./your-folder-path'` with the actual path to the folder containing your Markdown files.

- Run this Node.js script in a safe environment or on backup data to prevent any unintended file modifications.


This script will:

1. Recursively find all Markdown (`.md`) files in the specified folder and sub-folders.

2. Read each Markdown file to check if a UUID already exists in its YAML frontmatter.

3. If no UUID is found, the script generates a UUID using the `crypto` API and adds it to the file's YAML frontmatter.

4. Each modified file is then saved with the new or existing UUID in its frontmatter.


---

Please rewrite the following code to use ES6 imports and also to allow for this file to be used as a command line script or imported as an ES6 Module: 
```js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const matter = require('gray-matter');


// Function to recursively find markdown files

function findMarkdownFiles(dir, filesFound = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, filesFound); // Recursion for directories
    } else if (filePath.endsWith('.md')) {
      filesFound.push(filePath); // Accumulate Markdown files
    }
  });
  return filesFound;
}


// Function to generate a UUID

function generateUUID() {
  return crypto.randomUUID();
}


// Function to add UUID to YAML frontmatter

function addUuidToMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsedContent = matter(fileContent);
  if (!parsedContent.data.uuid) {
    parsedContent.data.uuid = generateUUID(); // Add UUID
    const newContent = matter.stringify(parsedContent.content, parsedContent.data);
    fs.writeFileSync(filePath, newContent);
    console.log(`UUID added to ${filePath}`);
  } else {
    console.log(`UUID already exists in ${filePath}`);
  }
}

// Main function to process files in a given folder

function processFilesInFolder(folderPath) {
  const markdownFiles = findMarkdownFiles(folderPath);
  markdownFiles.forEach(filePath => {
    addUuidToMarkdownFile(filePath);
  });
}


// Replace './your-folder-path' with the path to the folder you want to process

const folderPath = '..';
processFilesInFolder(folderPath);
```

To rewrite the provided code to use ES6 imports and to make it usable both as a command line script and as an ES6 module, you will need to follow these steps:


1. Replace `require` statements with `import` for ES6 compatibility.

2. Since ES6 modules do not have a direct equivalent for `__dirname` in CommonJS, use `import.meta.url` for path operations or any other necessary adjustments.

3. Export the main functionality (`processFilesInFolder`) so it can be imported into other modules.

4. Detect if the script is being run directly through the command line (not imported) using `import.meta.url` and `process.argv`.


Here's how the code can be adapted:


```js

// ES6 Imports

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// For __dirname equivalent in ES6 module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Function to recursively find markdown files

function findMarkdownFiles(dir, filesFound = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, filesFound); // Recursion for directories
    } else if (filePath.endsWith('.md')) {
      filesFound.push(filePath); // Accumulate Markdown files
    }
  });
  return filesFound;
}


// Function to generate a UUID

function generateUUID() {
  return crypto.randomUUID();
}


// Function to add UUID to YAML frontmatter

function addUuidToMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsedContent = matter(fileContent);
  if (!parsedContent.data.uuid) {
    parsedContent.data.uuid = generateUUID(); // Add UUID
    const newContent = matter.stringify(parsedContent.content, parsedContent.data);
    fs.writeFileSync(filePath, newContent);
    console.log(`UUID added to ${filePath}`);
  } else {
    console.log(`UUID already exists in ${filePath}`);
  }
}

// Main function to process files in a given folder
async function processFilesInFolder(folderPath) {
  const markdownFiles = findMarkdownFiles(folderPath);
  markdownFiles.forEach(filePath => {
    addUuidToMarkdownFile(filePath);
  });
} 


// Running the script conditionally based on its usage: Command Line or Imported as a Module

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // If no folder path is provided through the command line, use the current directory
  const folderPath = process.argv[2] || '.';
  processFilesInFolder(folderPath);
}

// Exporting the main function to allow importing in other modules

export { processFilesInFolder };

```


**Key Changes & Assumptions:**


- This script uses dynamic import checks to conditionally execute `processFilesInFolder` only if the script is run directly through the command line, not when it’s imported by another module.

- It’s assumed that users might want to run this script from the command line providing an optional directory path as the second argument. If no path is provided, it defaults to the current directory (`.`).

- To make it fully functional and adaptable for other users, replace any hardcoded folder paths or assumptions on usage tailored to your specific needs.

- Remember to ensure that your runtime environment supports ES6 module syntax (`import`/`export`), and that you're running a Node.js version that supports these features directly or use an appropriate transpiler or bundler as needed.
