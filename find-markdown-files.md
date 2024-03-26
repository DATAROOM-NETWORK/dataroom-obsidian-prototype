---
lastIndexed: never
lastUpdated: 2024-03-16T12:22:54.000Z
file-id: find-markdown-files
tags: null
type: software-snippet
latitude: 33.736061
longitude: -118.2922
ai-training-data: null
ai-training-weight: null
prompt: >-
  Please write a node.js script called "find-markdown-files.js". It should use
  ES6 import syntax. It should work both as a command line script as well as a
  script that can be imported via ES6. This file should import the function
  readMarkdownFile from the file read-markdown-file.js.  It should take two
  arguments: a path for the directory to search and a json object of the value
  we are looking for. It should find every markdown file in that directory and
  step through each one using the readMarkdownFile function. For your reference,
  the function you are importing looks like: ```js// file-name:
  read-markdown-file.jsimport fs from 'fs';import matter from
  'gray-matter';import path from 'path';function readMarkdownFile(filepath) {   
  try {        const fileContent = fs.readFileSync(filepath, 'utf8');       
  const result = matter(fileContent);        return JSON.stringify(result, null,
  2); // Pretty print JSON    } catch (error) {        console.error('Error
  reading or parsing file:', error);        return null;    }}// This block
  allows the script to be used both as a Node module and as a command line
  tool.if (process.argv[1].endsWith(path.basename(import.meta.url))) {    //
  Used from command line    const filePath = process.argv[2];    if (!filePath)
  {        console.error('Please provide a file path');       
  process.exit(1);    }    const fullPath = path.resolve(filePath);    const
  result = readMarkdownFile(fullPath);    console.log(result);} export default
  readMarkdownFile;```The JSON object provided should have a key and a search
  term. For instance, if I send you a json object that looks like:
  ```json{"tags": ["ai-training-data", "test-data"]}```It should return all
  markdown files that have both tags in their metadata. If I send a json object
  that looks like: ```json{"type": "ai-training-data"}```it should return all
  files with that type. If I send a json object that looks
  like:```json{"last-indexed":"never"}```it should return all files with a
  last-indexed value of "never". Please keep in mind that we may face memory
  issues, so please only load and read one markdown file at a time to ensure we
  always have enough memory.
status: completed
uuid: c8b41c31-7c6f-4edc-9a28-b3cd5e55a1cd
---

Below, you will find the implementation of "find-markdown-files.js". This file uses ES6 import syntax to import `readMarkdownFile` from "read-markdown-file.js". It's designed to work as both a command-line tool and a script that can be imported into other Node.js files. 


To address the requirement of memory efficiency, the script reads and processes markdown files one at a time. As Node.js fs module doesn't directly support asynchronous directory traversal, the script uses fs.promises API alongside async/await for reading files in a memory-efficient manner.


**find-markdown-files.js:**


```js
// Importing necessary modules using ES6 syntax

import fs from 'fs/promises';
import path from 'path';
import readMarkdownFile from './read-markdown-file.js';

// Function to find markdown files based on search criteria
async function findMarkdownFiles(dirPath, searchCriteria) {
    try {
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        let matchedFiles = [];
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const filePath = path.join(dirPath, file.name);
                const fileContent = await readMarkdownFile(filePath);
                const fileData = JSON.parse(fileContent);
                if (matchesCriteria(fileData.data, searchCriteria)) {
                    matchedFiles.push(filePath);
                }
            }
        }
        return matchedFiles;
    } catch (error) {
        console.error('Error finding markdown files:', error);
        return [];
    }
}


// Helper function to check if file data matches search criteria

function matchesCriteria(fileData, searchCriteria) {
    return Object.keys(searchCriteria).every((key) => {
        if (Array.isArray(searchCriteria[key])) {
            // If search criteria is an array, every item must match
            return searchCriteria[key].every(tag => fileData[key]?.includes(tag));
        } else {
            return fileData[key] === searchCriteria[key];
        }
    });
}


// This block allows the script to be used both as a Node module and as a command line tool.

if (process.argv[1].endsWith(path.basename(import.meta.url))) {
    (async () => {
        const dirPath = process.argv[2];
        try {
            const searchCriteria = JSON.parse(process.argv[3]);
            if (!dirPath) {
                console.error('Please provide a directory path');
                process.exit(1);
            }
            const matchedFiles = await findMarkdownFiles(dirPath, searchCriteria);
            console.log('Matched Files:', matchedFiles);
        } catch (error) {
            console.error('Error parsing arguments or finding files:', error);
            process.exit(1);
        }
    })();
}

// Export the findMarkdownFiles function for use in other modules
export default findMarkdownFiles;
```


To run this script from the command line, you would use a command like this, making sure to replace `path/to/directory` with the actual path you want to search, and the JSON object with your actual search criteria:


```bash

node find-markdown-files.js ../ '{"tags": ["ai-training-data", "test-data"]}'

```


To use this script as a module, you can import the `findMarkdownFiles` function into another JavaScript file and call it with the directory path and search criteria as arguments.
 

