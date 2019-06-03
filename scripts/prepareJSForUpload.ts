// Take the dist server code and push it + auto publish it.
import * as chalkModule from 'chalk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

// TODO - Fail if script dir does not exist

const serverScriptLocation = `${currentDir}/dist/serverCode.js`;

// we're going to remove this shit...
/*

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

*/

const chalk = chalkModule.default;

const init = async () => {
  // read the server code for contents
  let serverCode = fs.readFileSync(serverScriptLocation).toString('utf-8');
  // Upload and publish to PlayFab
  serverCode = serverCode.replace(/\"use strict\";/, '');
  serverCode = serverCode.replace(/Object.defineProperty.*?\);/, '');
  fs.writeFileSync(serverScriptLocation, serverCode, { encoding: 'utf-8' });
};

init();
