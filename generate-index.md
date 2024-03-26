---
lastIndexed: never
lastUpdated: 2024-03-16T18:18:52.000Z
file-id: generate-index
tags: null
type: software-snippet
latitude: 33.736061
longitude: -118.2922
ai-training-data: null
ai-training-weight: null
prompt: >-
  Please write a node.js script called "generate-index.js". It should use ES6
  import syntax. It should work both as a command line script as well as a
  script that can be imported via ES6. It should import the
  functions:**readMarkdownFile** from read-markdown-file.js. This file looks
  like:```js// file-name: read-markdown-file.jsimport fs from 'fs';import matter
  from 'gray-matter';import path from 'path';function readMarkdownFile(filepath)
  {    try {        const fileContent = fs.readFileSync(filepath,
  'utf8');        const result = matter(fileContent);        return
  JSON.stringify(result, null, 2); // Pretty print JSON    } catch (error)
  {        console.error('Error reading or parsing file:', error);        return
  null;    }}// This block allows the script to be used both as a Node module
  and as a command line tool.if
  (process.argv[1].endsWith(path.basename(import.meta.url))) {    // Used from
  command line    const filePath = process.argv[2];    if (!filePath) {       
  console.error('Please provide a file path');        process.exit(1);    }   
  const fullPath = path.resolve(filePath);    const result =
  readMarkdownFile(fullPath);    console.log(result);} export default
  readMarkdownFile;```**writeMarkdownFile** from write-markdown-file.js. This
  file looks like:```jsimport fs from 'fs';import matter from 'gray-matter';//
  The default export and cli handler functionconst writeMarkdownFile =
  (filePath, jsonObj) => {  try {    const { content, ...frontMatter } =
  jsonObj; // Destructure content and the rest of the data    const
  markdownContent = matter.stringify(content, frontMatter); // Utilize
  gray-matter to combine content and frontMatter    // Write to the file
  system    fs.writeFileSync(filePath, markdownContent, 'utf8');   
  console.log(`Markdown file written successfully to ${filePath}`);  } catch
  (error) {    console.error('Error writing markdown file:', error);  }};// To
  make it work as a command line program as wellif
  (process.argv[1].endsWith(path.basename(import.meta.url)) {  const [,,
  filePath, jsonStr] = process.argv;  if (!filePath || !jsonStr) {   
  console.log('Usage: node write-markdown-file.js <filePath> <jsonString>');   
  process.exit(1);  }    try {    // Parsing the JSON string passed as an
  argument    const jsonObj = JSON.parse(jsonStr);   
  writeMarkdownFile(filePath, jsonObj);  } catch (error) {   
  console.error('Error parsing JSON string:', error);    process.exit(1);  }}//
  Node default exportexport default writeMarkdownFile;```and also
  **findMarkdownFile** from the file find-markdown-file.js. This file looks
  like: ```js// Importing necessary modules using ES6 syntaximport fs from
  'fs/promises';import path from 'path';import readMarkdownFile from
  './read-markdown-file.js';// Function to find markdown files based on search
  criteriaasync function findMarkdownFiles(dirPath, searchCriteria) {    try
  {        const files = await fs.readdir(dirPath, { withFileTypes: true
  });        let matchedFiles = [];        for (const file of files)
  {            if (file.name.endsWith('.md')) {                const filePath =
  path.join(dirPath, file.name);                const fileContent = await
  readMarkdownFile(filePath);                const fileData =
  JSON.parse(fileContent);                if (matchesCriteria(fileData.data,
  searchCriteria)) {                   
  matchedFiles.push(filePath);                }            }        }       
  return matchedFiles;    } catch (error) {        console.error('Error finding
  markdown files:', error);        return [];    }}// Helper function to check
  if file data matches search criteriafunction matchesCriteria(fileData,
  searchCriteria) {    return Object.keys(searchCriteria).every((key) =>
  {        if (Array.isArray(searchCriteria[key])) {            // If search
  criteria is an array, every item must match            return
  searchCriteria[key].every(tag => fileData[key]?.includes(tag));        } else
  {            return fileData[key] === searchCriteria[key];        }    });}//
  This block allows the script to be used both as a Node module and as a command
  line tool.if (process.argv[1].endsWith(path.basename(import.meta.url))) {   
  (async () => {        const dirPath = process.argv[2];        try {           
  const searchCriteria = JSON.parse(process.argv[3]);            if (!dirPath)
  {                console.error('Please provide a directory
  path');                process.exit(1);            }            const
  matchedFiles = await findMarkdownFiles(dirPath, searchCriteria);           
  console.log('Matched Files:', matchedFiles);        } catch (error)
  {            console.error('Error parsing arguments or finding files:',
  error);            process.exit(1);        }    })();}// Export the
  findMarkdownFiles function for use in other modulesexport default
  findMarkdownFiles;```It should take 2 arguments: the target file and then the
  search term. It should use readMarkdownFile to read the target file and get
  the index-type value in the YAML front matterIt should use find-markdown-file
  to find all matching search terms, it should then rewrite the body of the
  target file with a list of all matching files in the format with double
  brackets like so:```[[filename-1]][[filename-2]]...```It should save this file
  using the readMarkdownFile function.
status: completed
uuid: c39d251f-c5b2-4ab7-8204-fa66cacab52e
---

Given the requirements and the files you've supplied, I will craft a script named `generate-index.js`. This script will utilize the provided import functions from the respective files and follow the functionality you've outlined. Here's how you can create `generate-index.js`:


```js

// generate-index.js

import path from 'path';
import readMarkdownFile from './read-markdown-file.js';
import writeMarkdownFile from './write-markdown-file.js';
import findMarkdownFiles from './find-markdown-files.js';

// Function to generate the index
async function generateIndex(targetFilePath, searchCriteria) {
    try {
        // Read the target markdown file
        const targetFileContent = JSON.parse(await readMarkdownFile(targetFilePath));
        console.log("Looking at:",targetFileContent.data);
        // Find markdown files based on the search term
        const matchedFiles = await findMarkdownFiles(path.dirname(targetFilePath), searchCriteria);
        console.log("matched files:", matchedFiles);
        // Redefining the body of the target file with a list of all matching files
        const updatedContent = Object.assign(targetFileContent.data, {
            content: matchedFiles.map(filepath => `[[${path.basename(filepath)}]]`).join('\n')
        });


        console.log(updatedContent);
        // Write the modified content back to the target file
        writeMarkdownFile(targetFilePath, updatedContent);
        console.log('Index generated successfully');
    } catch (error) {
        console.error('Error generating index:', error);
    }
}


// This block checks if the script is being run directly and takes command line arguments

if (process.argv[1].endsWith(path.basename(import.meta.url))) {
    const [,, targetFilePath, searchJson] = process.argv;
    if (!targetFilePath || !searchJson) {
        console.error('Usage: node generate-index.js <targetFilePath> <searchJson>');
        process.exit(1);
    }
    try {
        const searchCriteria = JSON.parse(searchJson);
        generateIndex(targetFilePath, searchCriteria);
    } catch (error) {
        console.error('Error parsing arguments:', error);
        process.exit(1);
    }
} 

export default generateIndex;

```


### Instructions:


1. Ensure you have the dependencies installed (`fs`, `matter`, and any other necessary ones like `@babel/core` for ES6 import syntax in older versions of Node.js).

2. Save this script as `generate-index.js` in the same directory as the other provided scripts.

3. You can now run this script from the command line by navigating to its directory and executing the following command: `node generate-index.js targetFile.md '{"searchTerm":"value"}'`. You need to replace `targetFile.md` with your Markdown file's path and adjust the JSON search criteria as necessary.

4. Alternatively, this script can be imported into another ES6 module and called with `await generateIndex(targetFilePath, searchCriteria)`.


This script meets the requirement of supporting both command-line usage and ES6 importability for further integration.
