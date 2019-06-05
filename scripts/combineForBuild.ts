/*

Given our server code + types, combine them into a file to be processed by PlayFab

*/

import * as chalkModule from 'chalk';
import * as fs from 'fs';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();
const chalk = chalkModule.default;

const typesLocation = `${currentDir}/src/types.ts`;
const utilsLocation = `${currentDir}/src/utils.ts`;
const apiLocation = `${currentDir}/src/api.ts`;

const combinedFileLocation = `${currentDir}/combined/serverCode.ts`;

if (!fs.existsSync(typesLocation) || !fs.existsSync(utilsLocation) || !fs.existsSync(apiLocation)) {
  console.log(chalk.red.bold('Missing files for combine. Please check and ensure you have all files setup'));
  process.exit(0);
}

const init = async () => {
  // ok, grab all types and port ALL of them into the server code
  let serverCodeOutput = fs.readFileSync(apiLocation).toString('utf-8');

  // remove imports
  serverCodeOutput = serverCodeOutput.replace(/^import .*/gm, '');

  // copy our utils stuff into the server code
  let utilsContent = fs.readFileSync(utilsLocation).toString('utf-8');

  // trim imports.
  utilsContent = utilsContent.replace(/^import .*/gm, '');

  // remote export prefix from stuff in here.
  utilsContent = utilsContent.replace(/^export /gm, '');

  // copy to bottom of server code
  serverCodeOutput += `\n${utilsContent}`;

  // do the same with our types files
  let typesContent = fs.readFileSync(typesLocation).toString('utf-8');

  // trim imports.
  typesContent = typesContent.replace(/^import .*/gm, '');

  // remote export prefix from stuff in here.
  typesContent = typesContent.replace(/^export /gm, '');

  // copy to bottom of server code
  serverCodeOutput += `\n${typesContent}`;

  fs.writeFileSync(combinedFileLocation, serverCodeOutput, { encoding: 'utf-8' });
  console.log(chalk.green.bold(`Files combined, ready for build + uploading`));
};

init();
