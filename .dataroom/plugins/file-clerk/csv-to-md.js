// Import modules

import csv from 'csv-parser';
import { createReadStream, writeFile } from 'fs/promises';
import { join } from 'path';

// Function to convert CSV row to YAML front matter with Markdown

async function csvToMarkdown(filename) {
  const results = [];


  // Promise to handle CSV parsing
  const parserPromise = new Promise((resolve, reject) => {
    createReadStream(filename)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });


  // Await until all CSV rows are parsed

  await parserPromise;


  // Create a Markdown file for each entry

  results.forEach(async (entry, index) => {
    const yamlFrontMatter = Object.keys(entry).map((key) => `${key}: "${entry[key]}"`).join('\n');
    const markdownContent = `---
${yamlFrontMatter}
---
${entry['content'] ? entry['content'] : ''}
`;
    try {
      await writeFile(join('output', `post-${index + 1}.md`), markdownContent);
      console.log(`Created: post-${index + 1}.md`);
    } catch (error) {
      console.error(`Failed to create markdown file for entry ${index + 1}: ${error}`);
    }
  });
}


// Main function call - make sure to adjust the filename if necessary

csvToMarkdown('data.csv').catch(console.error);