import * as chalkModule from 'chalk';
import * as fs from 'fs';
import { join } from 'path';

// TODO TODO TODO - Left off here.
// Ok, we'll pregen a bunch of good stuff. 
// then, we'll walk our types file + our client handlers to 
// build our exported stuff.

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

// const serverScriptLocation = `${currentDir}/combined/serverCode.ts`;
const typingsLocation = `${currentDir}/src/types.ts`;

const outputDir = `${currentDir}/client/index.ts`;

const callToPlayFabString = `import { PlayFab, PlayFabClient } from 'playfab-sdk';

export { PlayFab } from 'playfab-sdk';

export const SetPlayFabTitleId = (titleId: string) => {
  PlayFab.settings.titleId = titleId;
};

// Typings for playfab results to ensure visibility to errors, etc
interface PlayFabFunctionResult {
  FunctionName: string;
  Logs: object[];
  APIRequestsIssued: number;
  Error?: PlayFabCloudScriptModels.ScriptExecutionError;
}

// Auth methods.
// We add this in to get config on the restun too.
export const LoginWithCustomIdAsync = (customId: string): Promise<PlayFabClientModels.LoginResult> => {
  return new Promise<PlayFabClientModels.LoginResult>((resolve, reject) => {
    PlayFabClient.LoginWithCustomID(
      {
        CreateAccount: true,
        CustomId: customId,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LoginResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

export const LoginWithFacebookAsync = (accessToken: string): Promise<PlayFabClientModels.LoginResult> => {
  return new Promise<PlayFabClientModels.LoginResult>((resolve, reject) => {
    PlayFabClient.LoginWithFacebook(
      {
        CreateAccount: true,
        AccessToken: accessToken,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LoginResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

export const LinkWithFacebookAsync = (accessToken: string): Promise<PlayFabClientModels.LinkFacebookAccountResult> => {
  return new Promise<PlayFabClientModels.LinkFacebookAccountResult>((resolve, reject) => {
    PlayFabClient.LinkFacebookAccount(
      {
        ForceLink: true,
        AccessToken: accessToken,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LinkFacebookAccountResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

export const PFGetLeaderboardAroundPlayer = (statName: PlayFabStatistics): Promise <PlayFabClientModels.GetLeaderboardAroundPlayerResult> => {
  return new Promise<PlayFabClientModels.GetLeaderboardAroundPlayerResult>((resolve, reject) => {
    PlayFabClient.GetLeaderboardAroundPlayer(
      {
        StatisticName: statName,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.GetLeaderboardAroundPlayerResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

export const PFGetLeaderboard = (
  statName: PlayFabStatistics,
  startPosition: number = 0,
  numResults: number = 10): Promise <PlayFabClientModels.GetLeaderboardResult> => {
  return new Promise<PlayFabClientModels.GetLeaderboardResult>((resolve, reject) => {
    PlayFabClient.GetLeaderboard(
      {
        MaxResultsCount: numResults,
        StartPosition: startPosition,
        StatisticName: statName,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.GetLeaderboardResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

const callToPlayFab = (
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
};

// Allow the client to set the display name
export const PFSetDisplayName = async (DisplayName: string): Promise<PlayFabClientModels.UpdateUserTitleDisplayNameResult> => {
  return new Promise<PlayFabClientModels.UpdateUserTitleDisplayNameResult>((resolve, reject) => {
    PlayFabClient.UpdateUserTitleDisplayName({
      DisplayName,
    },
      (err, result) => {
        if (err) {
          console.log(JSON.stringify(err));
          reject(err);
        }
        resolve(result.data);
      })
  });
}

// Allow ability to also get read only data on command
export const PFGetCombinedData = (
  dataKeys: PlayFabUserDataKeys[],
  readOnlyKeys: PlayFabUserDataKeys[],
): Promise<PlayFabClientModels.GetPlayerCombinedInfoResult> => {
  return new Promise<PlayFabClientModels.GetPlayerCombinedInfoResult>((resolve, reject) => {
    const InfoRequestParameters: PlayFabClientModels.GetPlayerCombinedInfoRequestParams = {
      GetUserReadOnlyData: true,
      GetUserData: true,
      GetUserVirtualCurrency: true,
      GetCharacterInventories: false,
      GetCharacterList: false,
      GetPlayerStatistics: true,
      GetPlayerProfile: false,
      GetTitleData: false,
      GetUserAccountInfo: false,
      GetUserInventory: true,
    };
    if (dataKeys.length > 0) {
      InfoRequestParameters.UserDataKeys = dataKeys;
    }
    if (readOnlyKeys.length > 0) {
      InfoRequestParameters.UserReadOnlyDataKeys = readOnlyKeys;
    }
    PlayFabClient.GetPlayerCombinedInfo(
      {
        InfoRequestParameters,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.GetPlayerCombinedInfoResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

export const PFSetUserData = (Data: {
  [key: string]: string;
}): Promise<PlayFabClientModels.UpdateUserDataResult> => {
  return new Promise<PlayFabClientModels.UpdateUserDataResult>((resolve, reject) => {
    // we need for the types here to be strings. important - may want a check in here.
    PlayFabClient.UpdateUserData(
      {
        Data,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.UpdateUserDataResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};`;

// Ok, generate it!

const chalk = chalkModule.default;

const init = async () => {
  // read the server code for contents
  let clientDTSString = `/*
  Please do not manually edit.
*/`;

  // ^interface (\w*) {(.*?)}\n
  // ^enum (\w*) {(.*?)}\n
  // ^type (\w*) = {(.*?)}\n

  // we're just going to copy types across... skip all this regex shit.

  // Find our interfaces, enums + types in our server code + make them available in client (and simulation)
  // code
  //const interfaceRegex = /^interface (\w*) {(.*?)}\n/gms;
  const interfaceRegex = /^export interface (\w*?)( extends .*?)? {(.*?)\n}/gms;


  const enumRegex = /^export enum (\w*) {(.*?)\n}/gms;
  // const typeRegex = /^export type (\w*) = {(.*?)\n}/gms;
  const typeRegex = /^export type (\w*) = (\w*?) ?&? ?{(.*?)}\n/gms;


  // we're going to use our source stuff, nto the combined as there'll be stuff
  // I DON'T want going back to the client. 
  // All things in types, and the handler functions i want to grab.

  const typingsData = fs.readFileSync(typingsLocation).toString('utf-8');
  clientDTSString += typingsData;
  // add our types, interfaces and enums to the client dts string

//   let m;

//   // tslint:disable-next-line: no-conditional-assignment
//   while ((m = interfaceRegex.exec(typingsData)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     if (m.index === interfaceRegex.lastIndex) {
//       interfaceRegex.lastIndex++;
//     }
//     let interfaceHeader = `${m[1]}`;
//     if (m[2]) {
//       interfaceHeader = `${m[1]} ${m[2]}`;
//     }
//     clientDTSString += `
// export interface ${interfaceHeader} {
// ${m[3]}
// }`;
//   }

//   // tslint:disable-next-line: no-conditional-assignment
//   while ((m = enumRegex.exec(typingsData)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     if (m.index === enumRegex.lastIndex) {
//       enumRegex.lastIndex++;
//     }
//     clientDTSString += `
// export enum ${m[1]} {${m[2]}}`;
//   }

//   // tslint:disable-next-line: no-conditional-assignment
//   while ((m = typeRegex.exec(typingsData)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     if (m.index === typeRegex.lastIndex) {
//       typeRegex.lastIndex++;
//     }
//     console.log(m[1])
//     console.log(m[2]);
//     const typeExtends = m[2] ? `${m[2]} & ` : ``;
//     clientDTSString += `
// export type ${m[1]} = ${typeExtends}{
// ${m[3]}
// }`;
//   }
  // Seed our method to call the lib.
  clientDTSString += `\n${callToPlayFabString}`;

  // Now, grab the client handlers
  const clientAPICallsDirectory = `${currentDir}/src/clientHandlers/`;
  const clientFileList = fs.readdirSync(clientAPICallsDirectory);

  clientFileList.forEach((fileName) => {
    // console.log(join(clientAPICallsDirectory, fileName));
    let output = fs.readFileSync(join(clientAPICallsDirectory, fileName)).toString('utf-8');
    // for each of these, drop our imports
    output = output.replace(/^import .*? from ['"].*?['"];/gms, '');
    // now, add our handler based on our regex
    //console.log(output);
    const regex = /const (.*?) = \((.*?)\): (.*?) =/gs;
    //const regex = /^const (.*?) = \(/gm;
    const m = regex.exec(output);
    // console.log(m);
    const methodName = m[1];
    const methodSignature: string = m[2];
    const sigTypeMatch = methodSignature.match(/: (\w+)/);
    let payloadSig = ``;
    let payloadEntry = `, {}`;
    if (sigTypeMatch !== null) {
      payloadSig = `payload: ${sigTypeMatch[1]}`;
      payloadEntry = `, payload`;
    }

    const methodReturn = m[3];
    clientDTSString += '\n';
    clientDTSString += `
export interface PlayFab${methodReturn} extends PlayFabFunctionResult {
  FunctionResult: ${methodReturn};
}

export const Call${methodName} = async (${payloadSig}): Promise<PlayFab${methodReturn}> => {
  const response = await callToPlayFab('${methodName}'${payloadEntry});
  const data: PlayFab${methodReturn} = {
    FunctionName: response.FunctionName,
    Logs: response.Logs,
    FunctionResult: response.FunctionResult,
    APIRequestsIssued: response.APIRequestsIssued,
  };
  if (response.Error) {
    data.Error = response.Error;
  }
  return data;
};`;

  });


  //   const exposedServerCallRegex = /\/\* Client \*\/.*?const (.*?) = \((.*?)\): (.*?) =/gs;

  //   // tslint:disable-next-line: no-conditional-assignment
  //   while ((m = exposedServerCallRegex.exec(typingsData)) !== null) {
  //     // This is necessary to avoid infinite loops with zero-width matches
  //     if (m.index === exposedServerCallRegex.lastIndex) {
  //       exposedServerCallRegex.lastIndex++;
  //     }

  //     // The result can be accessed through the `m`-variable.
  //     const methodName = m[1];
  //     const methodSignature: string = m[2];
  //     const sigTypeMatch = methodSignature.match(/: (\w+)/);
  //     let payloadSig = ``;
  //     let payloadEntry = `, {}`;
  //     if (sigTypeMatch !== null) {
  //       payloadSig = `payload: ${sigTypeMatch[1]}`;
  //       payloadEntry = `, payload`;
  //     }

  //     const methodReturn = m[3];
  //     clientDTSString += '\n';
  //     clientDTSString += `
  // interface PlayFab${methodReturn} extends PlayFabFunctionResult {
  //   FunctionResult: ${methodReturn};
  // }

  // export const Call${methodName} = async (${payloadSig}): Promise<PlayFab${methodReturn}> => {
  //   const response = await callToPlayFab('${methodName}'${payloadEntry});
  //   const data: PlayFab${methodReturn} = {
  //     FunctionName: response.FunctionName,
  //     Logs: response.Logs,
  //     FunctionResult: response.FunctionResult,
  //     APIRequestsIssued: response.APIRequestsIssued,
  //   };
  //   if (response.Error) {
  //     data.Error = response.Error;
  //   }
  //   return data;
  // };`;
  //   }
  clientDTSString += `\n`;

  fs.writeFileSync(outputDir, clientDTSString, { encoding: 'utf-8' });
  console.log(chalk.greenBright('Client files created and ready to compile!'));
};

init();
