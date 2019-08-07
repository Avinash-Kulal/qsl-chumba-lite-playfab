import * as chalkModule from 'chalk';
import * as fs from 'fs';
import { join } from 'path';
// import {join} from 'fs'
/*

Given our server code + types, combine them into a file to be processed by PlayFab

*/


// Setup environment to look at the calling dir.
const currentDir = process.cwd();
const chalk = chalkModule.default;

const typesLocation = `${currentDir}/src/types.ts`;
const utilsLocation = `${currentDir}/src/utils.ts`;
const clientAPICallsDirectory = `${currentDir}/src/clientHandlers/`;
const qaAPICallsDirectory = `${currentDir}/src/qaHandlers/`;
//const apiLocation = `${currentDir}/src/api.ts`;

const combinedFileLocation = `${currentDir}/combined/serverCode.ts`;

if (
  !fs.existsSync(typesLocation) ||
  !fs.existsSync(utilsLocation)
  // ||
  // !fs.existsSync(apiLocation)
) {
  console.log(
    chalk.red.bold(
      'Missing files for combine. Please check and ensure you have all files setup'
    )
  );
  process.exit(0);
}

// check and see if we have Client API calls
if (!fs.existsSync(clientAPICallsDirectory)) {
  console.log(chalk.red.bold('Missing client API calls dir!'));
  process.exit(0);
}
// check and see if combined dir exists.
if (!fs.existsSync(`${currentDir}/combined/`)) {

  console.log(chalk.red.bold('Combined folder does not exist, creating one for you'));

  fs.mkdirSync(`${currentDir}/combined/`);

}

const init = async () => {
  // let's aggregate all the client data + make sure there are handlers for each
  

  let apiOutput = '';

  const clientFileList = fs.readdirSync(clientAPICallsDirectory);

  clientFileList.forEach((fileName) => {
    console.log(join(clientAPICallsDirectory, fileName));
    let output = fs.readFileSync(join(clientAPICallsDirectory, fileName)).toString('utf-8');
    // for each of these, drop our imports
    output = output.replace(/^import .*? from ['"].*?['"];/gms, '');
    // now, add our handler based on our regex
    //console.log(output);
    const regex = /^const (.*?) = \(/gm;
    const match = regex.exec(output);
    
    const handlerName = match[1];
    output += `\nhandlers.${handlerName} = ${handlerName};`
    apiOutput += output;
  })

  const qaFileList = fs.readdirSync(qaAPICallsDirectory);

  qaFileList.forEach((fileName) => {
    console.log(join(qaAPICallsDirectory, fileName));
    let output = fs.readFileSync(join(qaAPICallsDirectory, fileName)).toString('utf-8');
    // for each of these, drop our imports
    output = output.replace(/^import .*? from ['"].*?['"];/gms, '');
    // now, add our handler based on our regex
    //console.log(output);
    const regex = /^const (.*?) = \(/gm;
    const match = regex.exec(output);
    
    const handlerName = match[1];
    output += `\nhandlers.${handlerName} = ${handlerName};`
    apiOutput += output;
  })

  // copy our utils stuff into the server code
  let utilsContent = fs.readFileSync(utilsLocation).toString('utf-8');

  // trim imports.
  utilsContent = utilsContent.replace(/^import .*? from '.*?';/gms, '');

  // remote export prefix from stuff in here.
  utilsContent = utilsContent.replace(/^export /gm, '');

  // Put at top
  apiOutput = `${utilsContent}\n${apiOutput}`;

  // do the same with our types files
  let typesContent = fs.readFileSync(typesLocation).toString('utf-8');

  // trim imports.
  typesContent = typesContent.replace(/^import .*? from '.*?';/gms, '');

  // remote export prefix from stuff in here.
  typesContent = typesContent.replace(/^export /gm, '');

  // put at top
  apiOutput = `${typesContent}\n${apiOutput}`;

  fs.writeFileSync(combinedFileLocation, apiOutput, {
    encoding: 'utf-8'
  });
  console.log(chalk.green.bold(`Files combined, ready for build + uploading`));
};

init();
