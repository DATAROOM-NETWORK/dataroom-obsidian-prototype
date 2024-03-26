---
lastIndexed: never
lastUpdated: 2024-03-16T12:17:37.000Z
file-id: read-markdown-file
tags:
  - ai-training-data
  - prompt
  - script
type: software-snippet
latitude: 33.736061
longitude: -118.2922
ai-training-data: true
ai-training-weight: 1
prompt: >-
  Please write a node.js script that reads a markdown file and parses YAML front
  matter if it exists, and reads the content of the file. It should return both
  as a JSON string. It should work as a node default export and also as a
  command line program.
script: read-markdown-file.js
status: completed
uuid: 12f54e9f-8e0b-4efc-904c-25f675e2c6a9
---
# #2024-03-16 12:17:37 
#software-snippet 

```sh
npm install gray-matter
```


```javascript

// file-name: read-markdown-file.js

import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

function readMarkdownFile(filepath) {
    try {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        const result = matter(fileContent);
        return JSON.stringify(result, null, 2); // Pretty print JSON
    } catch (error) {
        console.error('Error reading or parsing file:', error);
        return null;
    }
}

// This block allows the script to be used both as a Node module and as a command line tool.
if (process.argv[1].endsWith(path.basename(import.meta.url))) {
    // Used from command line
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Please provide a file path');
        process.exit(1);
    }

    const fullPath = path.resolve(filePath);
    const result = readMarkdownFile(fullPath);
    console.log(result);

} 

export default readMarkdownFile;

```


```bash

node read-markdown-file.js path/to/your/markdown.md

```

