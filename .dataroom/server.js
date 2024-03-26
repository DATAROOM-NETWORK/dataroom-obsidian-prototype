/*

  SERVER

  This is to wire together components and prototype quick ideas, not run the 
  business logic.

  Software is, above all things, a human / computer interface. This bundle of 
  text is your interface between the server and you: keep it clear and humane.

*/


// Import external libraries
import express from 'express';
import { createServer } from 'https';
import { readFileSync, existsSync } from 'fs';
import path, { join } from 'path';
import os from 'os';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import routes from './routes.js';


// Initialize Express Server
const app = express();

// Load the .env file
dotenv.config();
let PORT = process.env.PORT || 3838;

// Get the local IP address and stash it in a global variable

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const key in interfaces) {
    for (const iface of interfaces[key]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
        return iface.address;
      }
    }
  }
  return null;
}

global.ip_address = getLocalIpAddress();

// Store the Hostname globalls
global.hostname = os.hostname();


// Get the root directory and store it globally
const currentModuleURL = new URL(import.meta.url);
const rootDirectory = decodeURIComponent(new URL('.', currentModuleURL).pathname);
global.root_directory = rootDirectory;

/*

  ROUTES

*/

const routesInstance = routes(app, express);

// Check if private-key.pem and certificate.pem files exist
const privateKeyPath = join(rootDirectory, 'private-key.pem');
const certificatePath = join(rootDirectory, 'certificate.pem');

if (!existsSync(privateKeyPath) || !existsSync(certificatePath)) {
  console.log('Certificates not found. Generating new certificates...');
  // Generate new self-signed certificates using openssl
  try {
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout ${privateKeyPath} -out ${certificatePath} -days 365 -nodes -subj "/CN=${hostname}"`);
    console.log('New certificates generated successfully.');
  } catch (error) {
    console.error('Error generating certificates:', error.message);
  }
}

// Configure HTTPS server
const httpsOptions = {
  key: readFileSync(privateKeyPath),
  cert: readFileSync(certificatePath),
};

const httpsServer = createServer(httpsOptions, app);
httpsServer.listen(PORT, () => {
  console.log(`Server listening on port https://${global.hostname}:${PORT} and serving ${global.root_directory}`);
});