import MarkdownIt from 'markdown-it';
import createWikiLinks from 'markdown-it-wikilinks';


import { glob } from 'glob';
import path from 'path';
import { promises as fs } from 'fs'; // Use fs.promises for async/await support
import { fileURLToPath } from 'url';
import { dirname } from 'path';



// Getting __dirname in ES module node.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {uriSuffix: ''};
const wikilinks = createWikiLinks(options);

const md = new MarkdownIt()
  .use(wikilinks)
;

export default async function (app, express) {


  const rootDir = path.join(__dirname, '../../../');
  app.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const filePath = path.join(rootDir, `${fileId}.md`);
    // Search recursively for the markdown file
    try {
      // Read the content of the file
      const content = await fs.readFile(filePath, 'utf8');  
      // Convert Markdown to HTML
      const header = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dataroom</title>
  <link rel="stylesheet" type="text/css" href="/index.css">
  <script src="/index.js" type="module"></script>
  <style>
    body {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    header, footer {
      flex-shrink: 0;
    }
    main {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center; /* Center children of main */
    }
    img {
      max-width: 40em; /* Responsive image scaling */
      height: auto;
      margin: auto;
    }
  </style>
</head>
<body>

  <header>
    <h1>DATAROOM</h1>
  </header>

  <main>


      `
      const htmlContent = md.render(content);

      const footer = `
  <footer>
    <h4>Copyright 2024</h4>
  </footer>

</body>
</html>


      `
      res.send(header + htmlContent + footer);
    } catch (err) {
      res.status(500).send('Error reading the file.');
    }
  });
}
