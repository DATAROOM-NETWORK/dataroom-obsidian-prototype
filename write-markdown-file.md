---
lastIndexed: never
lastUpdated: 2024-03-16T12:17:45.000Z
file-id: write-markdown-file
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
  Please write a node.js script using ES6 import syntax that writes a markdown
  file with YAML front matter to the file system. It should take two arguments:
  the file-path and a json object. The "content" key in the json object should
  be the body of the markdown file, all other fields in the JSON should be
  embedded as YAML front matter.


  It should work as a node default export and also as a command line program.
status: completed
uuid: 25f21d48-129f-40a4-83da-b04653bc3c4a
---
# #2024-03-16 12:17:45 
#software-snippet


```sh

npm install gray-matter

```

```javascript
// file-name: write-markdown-file.js

import fs from 'fs';
import matter from 'gray-matter';


// The default export and cli handler function
const writeMarkdownFile = (filePath, jsonObj) => {
  try {
    const { content, ...frontMatter } = jsonObj; // Destructure content and the rest of the data
    const markdownContent = matter.stringify(content, frontMatter); // Utilize gray-matter to combine content and frontMatter
    // Write to the file system
    fs.writeFileSync(filePath, markdownContent, 'utf8');
    console.log(`Markdown file written successfully to ${filePath}`);
  } catch (error) {
    console.error('Error writing markdown file:', error);
  }
};


// To make it work as a command line program as well


if (process.argv[1].endsWith(path.basename(import.meta.url)) {
  const [,, filePath, jsonStr] = process.argv;
  if (!filePath || !jsonStr) {
    console.log('Usage: node write-markdown-file.js <filePath> <jsonString>');
    process.exit(1);
  }
  
  try {
    // Parsing the JSON string passed as an argument
    const jsonObj = JSON.parse(jsonStr);
    writeMarkdownFile(filePath, jsonObj);
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    process.exit(1);
  }
}

// Node default export

export default writeMarkdownFile;
```


```sh

node write-markdown-file.js '../test.md' '{"title": "Test Title", "date": "2023-04-01", "content": "This is the content of the markdown file."}'

```

