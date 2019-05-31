// Take the dist server code and push it + auto publish it.
import * as chalkModule from 'chalk';
import * as fs from 'fs';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

const typesLocation = `${currentDir}/types/types.ts`;
const serverScriptLocation = `${currentDir}/src/serverCode.ts`;

const outputDir = `${currentDir}/client/index.ts`;

const callToPlayFabString = `import { PlayFabClient } from 'playfab-sdk';
const callToPlayFab = async (
  FunctionName: string,
  FunctionParameter: any,
): Promise<PlayFabCloudScriptModels.ExecuteCloudScriptResult> => {
  return new Promise<PlayFabCloudScriptModels.ExecuteCloudScriptResult>((resolve, reject) => {
    PlayFabClient.ExecuteCloudScript(
      {
        FunctionName,
        FunctionParameter,
      },
      (error, result) => {
        if (error) {
          console.log(JSON.stringify(error));
          reject(error);
        }
        resolve(result.data);
      },
    );
  });
};`;

// Ok, generate it!

const chalk = chalkModule.default;

const init = async () => {
  // read the server code for contents
  let clientDTSString = `/*
  Generated at ${Date.now()}
  Please do not manually edit.
*/`;

  // copy in types
  const typesStringData = fs.readFileSync(typesLocation).toString('utf-8');
  clientDTSString += `\n${typesStringData}`;

  // Seed our method to call the lib.
  clientDTSString += `\n${callToPlayFabString}`;

  // now, grab public methods from the server script
  const serverScriptData = fs.readFileSync(serverScriptLocation).toString('utf-8');
  const regex = /\/\* Client \*\/.*?const (.*?) = \((.*?)\): (.*?) =/gs;

  let m;

  while ((m = regex.exec(serverScriptData)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    // console.log(m);
    const methodName = m[1];
    const methodSignature: string = m[2];
    const sigTypeMatch = methodSignature.match(/: (\w+)/);

    const methodReturn = m[3];
    clientDTSString += '\n';
    clientDTSString += `
export const Call${methodName} = async (payload: ${sigTypeMatch[1]} ): Promise<${methodReturn}> => {
  const response = await callToPlayFab('${methodName}', payload);
  return response.FunctionResult;
};`;
  }
  clientDTSString += `\n`;
  fs.writeFileSync(outputDir, clientDTSString, { encoding: 'utf-8' });
};

init();
