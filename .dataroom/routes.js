/*
  
  ROUTES

  Place routes here.

 */

import path, { join } from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';

export default async function (app, express) {



  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  // Parse application/json
  app.use(bodyParser.json());


  // Middleware to serve static files except .md and .json

  app.use('/plugins', express.static(join(global.root_directory, '/plugins')));
  app.use(express.static(path.join(__dirname, '../')));

  /*
  
    index.js  

    index.js routes are built dynamically on load

  */
   
  // Cache variable to store the content of index.js
  let indexJsCache = '';
  let isCacheValid = false;

  // Function to update the cache
  async function updateIndexJsCache() {
    const pluginsDirectory = path.join(global.root_directory, 'plugins');
    let indexJsContent = '';

    // Read the contents of the plugins directory
    const pluginFolders = fs.readdirSync(pluginsDirectory, { withFileTypes: true });

    // Iterate through each folder in the plugins directory
    for (const folder of pluginFolders) {
      if (folder.isDirectory()) {
        const pluginPath = path.join(pluginsDirectory, folder.name);
        const indexPath = path.join(pluginPath, 'index.js');

        try {
          // Check if the folder contains an "index.js" file
          if (fs.existsSync(indexPath)) {
            // Import the "index.js" file and add it to the content
            indexJsContent += `import "/plugins/${folder.name}/index.js";\n`;
          }
        } catch (error) {
          console.error(`Error checking for index.js in ${indexPath}: ${error.message}`);
        }
      }
    }

    // Update the cache
    indexJsCache = indexJsContent;
    isCacheValid = true;
  }

  // Watch the plugins directory for changes
  fs.watch(path.join(global.root_directory, 'plugins'), (eventType, filename) => {
    console.log(`Detected changes in the plugins directory: ${filename}`);
    isCacheValid = false; // Invalidate the cache
  });

  // Express route
  app.get('/index.js', async function(req, res) {
    // Check if the cache is valid, if not update it
    if (!isCacheValid) {
      await updateIndexJsCache();
    }

    // Send the cached index.js content as the response
    res.type('text/javascript').send(indexJsCache);
  });


  /*
  
    index.css

    index.css is built dynamically on load. 

   */
   // Cache variable to store the content of index.css
  let indexCssCache = '';
  let isCssCacheValid = false;

  // Function to update the cache for index.css
  async function updateIndexCssCache() {
    const pluginsDirectory = path.join(global.root_directory, 'plugins');
    let indexCssContent = '';

    // Read the contents of the plugins directory
    const pluginFolders = fs.readdirSync(pluginsDirectory, { withFileTypes: true });

    // Iterate through each folder in the plugins directory
    for (const folder of pluginFolders) {
      if (folder.isDirectory()) {
        const pluginPath = path.join(pluginsDirectory, folder.name);
        const indexPath = path.join(pluginPath, 'index.css');

        try {
          // Check if the folder contains an "index.css" file
          if (fs.existsSync(indexPath)) {
            // Read the content of the "index.css" file and add it to the response
            indexCssContent += `@import "/plugins/${folder.name}/index.css";\n`;
          }
        } catch (error) {
          console.error(`Error checking for index.css in ${indexPath}: ${error.message}`);
        }
      }
    }

    // Update the cache
    indexCssCache = indexCssContent;
    isCssCacheValid = true;
  }

  // Watch the plugins directory for changes
  fs.watch(path.join(global.root_directory, 'plugins'), (eventType, filename) => {
    console.log(`Detected changes in the plugins directory: ${filename}`);
    isCssCacheValid = false; // Invalidate the cache
  });

  // Express route for index.css
  app.get('/index.css', async function(req, res) {
    // Check if the cache is valid, if not update it
    if (!isCssCacheValid) {
      await updateIndexCssCache();
    }

    // Send the cached index.css content as the response
    res.type('text/css').send(indexCssCache);
  });

    /*
      
      PLUGINS ROUTES

      Plugins routes are built dynamically on load

  */

  // Read Plugins for Routes
  const pluginsDirectory = path.join(global.root_directory, 'plugins');

  // Read the contents of the plugins directory
  const pluginFolders = fs.readdirSync(pluginsDirectory, { withFileTypes: true });

  // Iterate through each folder in the plugins directory
  for (const folder of pluginFolders) {
    if (folder.isDirectory()) {
      const pluginPath = path.join(pluginsDirectory, folder.name);
      const routesFilePath = path.join(pluginPath, 'routes.js');
      try {
        // Check if the folder contains a "routes.js" file
        if (fs.existsSync(routesFilePath)) {
          // Dynamically import the "routes.js" file
          const routesModule = await import(routesFilePath);

          // Instantiate the instance if it exports a default function
          if (typeof routesModule.default === 'function') {
            const pluginInstance = routesModule.default(app);
            // Optionally, you can do something with the instantiated instance
          } else {
            console.error(`Invalid export in ${routesFilePath}. It should export a default function.`);
          }
        }
      } catch (error) {
        console.error(`Error importing routes from ${routesFilePath}: ${error.message}`);
      }
    }
  }



}