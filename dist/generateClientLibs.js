"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalkModule = require("chalk");
const fs = require("fs");
const currentDir = process.cwd();
const serverScriptLocation = `${currentDir}/combined/serverCode.ts`;
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

export const GetLeaderboardAroundPlayer = (statName: PlayFabStatistics): Promise <PlayFabClientModels.GetLeaderboardAroundPlayerResult> => {
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

export const GetLeaderboard = (
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

// Allow ability to also get read only data on command
export const PFGetCombinedData = (
  dataKeys: UserDataKeys[],
  readOnlyKeys: UserDataKeys[],
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
const chalk = chalkModule.default;
const init = () => __awaiter(this, void 0, void 0, function* () {
    let clientDTSString = `/*
  Generated at ${Date.now()}
  Please do not manually edit.
*/`;
    const interfaceRegex = /^interface (\w*) {(.*?)}\n/gms;
    const enumRegex = /^enum (\w*) {(.*?)}\n/gms;
    const typeRegex = /^type (\w*) = {(.*?)}\n/gms;
    const serverScriptData = fs.readFileSync(serverScriptLocation).toString('utf-8');
    let m;
    while ((m = interfaceRegex.exec(serverScriptData)) !== null) {
        if (m.index === interfaceRegex.lastIndex) {
            interfaceRegex.lastIndex++;
        }
        clientDTSString += `
export interface ${m[1]} {
${m[2]}
}`;
    }
    while ((m = enumRegex.exec(serverScriptData)) !== null) {
        if (m.index === enumRegex.lastIndex) {
            enumRegex.lastIndex++;
        }
        clientDTSString += `
export enum ${m[1]} {${m[2]}}`;
    }
    while ((m = typeRegex.exec(serverScriptData)) !== null) {
        if (m.index === typeRegex.lastIndex) {
            typeRegex.lastIndex++;
        }
        clientDTSString += `
export type ${m[1]} = {
${m[2]}
}`;
    }
    clientDTSString += `\n${callToPlayFabString}`;
    const exposedServerCallRegex = /\/\* Client \*\/.*?const (.*?) = \((.*?)\): (.*?) =/gs;
    while ((m = exposedServerCallRegex.exec(serverScriptData)) !== null) {
        if (m.index === exposedServerCallRegex.lastIndex) {
            exposedServerCallRegex.lastIndex++;
        }
        const methodName = m[1];
        const methodSignature = m[2];
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
interface PlayFab${methodReturn} extends PlayFabFunctionResult {
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
    }
    clientDTSString += `\n`;
    fs.writeFileSync(outputDir, clientDTSString, { encoding: 'utf-8' });
});
init();
