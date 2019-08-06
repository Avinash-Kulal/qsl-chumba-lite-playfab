import * as chalkModule from 'chalk';
import * as fs from 'fs';
/*

Given our server code + types, combine them into a file to be processed by PlayFab

*/


// Setup environment to look at the calling dir.
const currentDir = process.cwd();
const chalk = chalkModule.default;

const typesLocation = `${currentDir}/src/types.ts`;
const utilsLocation = `${currentDir}/src/utils.ts`;
const apiLocation = `${currentDir}/src/api.ts`;

const combinedFileLocation = `${currentDir}/combined/serverCode.ts`;

if (
  !fs.existsSync(typesLocation) ||
  !fs.existsSync(utilsLocation) ||
  !fs.existsSync(apiLocation)
) {
  console.log(
    chalk.red.bold(
      'Missing files for combine. Please check and ensure you have all files setup'
    )
  );
  process.exit(0);
}

// check and see if combined dir exists.
if (!fs.existsSync(`${currentDir}/combined/`)) {
  console.log(chalk.red.bold('Please create a `combined` folder'));
  process.exit(0);
}

const init = async () => {
  // ok, grab all types and port ALL of them into the server code
  let serverCodeOutput = fs.readFileSync(apiLocation).toString('utf-8');

  // remove imports
  serverCodeOutput = serverCodeOutput.replace(/^import .*? from '.*?';/gms, '');

  // copy our utils stuff into the server code
  let utilsContent = fs.readFileSync(utilsLocation).toString('utf-8');

  // trim imports.
  utilsContent = utilsContent.replace(/^import .*? from '.*?';/gms, '');

  // remote export prefix from stuff in here.
  utilsContent = utilsContent.replace(/^export /gm, '');

  // Put at top
  serverCodeOutput = `${utilsContent}\n${serverCodeOutput}`;

  // do the same with our types files
  let typesContent = fs.readFileSync(typesLocation).toString('utf-8');

  // trim imports.
  typesContent = typesContent.replace(/^import .*? from '.*?';/gms, '');

  // remote export prefix from stuff in here.
  typesContent = typesContent.replace(/^export /gm, '');

  // put at top
  serverCodeOutput = `${typesContent}\n${serverCodeOutput}`;

  fs.writeFileSync(combinedFileLocation, serverCodeOutput, {
    encoding: 'utf-8'
  });
  console.log(chalk.green.bold(`Files combined, ready for build + uploading`));
};

init();
