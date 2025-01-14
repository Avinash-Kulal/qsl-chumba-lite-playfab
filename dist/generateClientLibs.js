"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalkModule = require("chalk");
const fs = require("fs");
const path_1 = require("path");
const currentDir = process.cwd();
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

export const LinkWithCustomIDAsync = (CustomId: string): Promise<PlayFabClientModels.LinkCustomIDResult> => {
  return new Promise<PlayFabClientModels.LinkCustomIDResult>((resolve, reject) => {
    PlayFabClient.LinkCustomID(
      {
        ForceLink: true,
        CustomId,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LinkCustomIDResult>) => {
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

export const LoginWithGoogleAccountAsync = (AccessToken: string): Promise<PlayFabClientModels.LoginResult> => {
  return new Promise<PlayFabClientModels.LoginResult>((resolve, reject) => {
    PlayFabClient.LoginWithGoogleAccount(
      ({
        CreateAccount: true,
        AccessToken,
      } as any),
      (err: PlayFabModule.IPlayFabError, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LoginResult>) => {
        if (err) {
          return reject(err);
        }
        resolve(res.data);
      },
    );
  });
};

export const LoginWithOpenIdConnect = (ConnectionId: string, IdToken: string): Promise<PlayFabClientModels.LoginResult> => {
  return new Promise<PlayFabClientModels.LoginResult>((resolve, reject) => {
    PlayFabClient.LoginWithOpenIdConnect(
      {
        CreateAccount: true,
        ConnectionId,
        IdToken
      },
      (err: PlayFabModule.IPlayFabError, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LoginResult>) => {
        if (err) {
          return reject(err);
        }
        resolve(res.data);
      }
    );
  });
}

export const LinkWithOpenIdConnect = (ConnectionId: string, IdToken: string, ForceLink: boolean = false): Promise<PlayFabClientModels.EmptyResult> => {
  return new Promise<PlayFabClientModels.EmptyResult>((resolve, reject) => {
    PlayFabClient.LinkOpenIdConnect(
      {
        ConnectionId,
        IdToken,
        ForceLink
      },
      (err: PlayFabModule.IPlayFabError, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.EmptyResult>) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
}

export const LinkWithGoogleAsync = (AccessToken: string, ForceLink: boolean = false): Promise<PlayFabClientModels.LinkGoogleAccountResult> => {
  return new Promise<PlayFabClientModels.LinkGoogleAccountResult>((resolve, reject) => {
    PlayFabClient.LinkGoogleAccount(
      {
        ForceLink,
        AccessToken,
      } as any,
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LinkGoogleAccountResult>) => {
        if (error) {
          return reject(error);
        }
        resolve(res);
      },
    );
  });
};

export const LinkWithFacebookAsync = (accessToken: string, ForceLink: boolean = false): Promise<PlayFabClientModels.LinkFacebookAccountResult> => {
  return new Promise<PlayFabClientModels.LinkFacebookAccountResult>((resolve, reject) => {
    PlayFabClient.LinkFacebookAccount(
      {
        ForceLink,
        AccessToken: accessToken,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LinkFacebookAccountResult>) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      },
    );
  });
};

export const UnlinkFacebookAccountAsync = (): Promise<PlayFabClientModels.UnlinkFacebookAccountResult> => {
  return new Promise<PlayFabClientModels.UnlinkFacebookAccountResult>((resolve, reject) => {
    PlayFabClient.UnlinkFacebookAccount(
      { },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.UnlinkFacebookAccountResult>) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      },
    );
  });
};

export const UnlinkOpenIdConnect = (ConnectionId: string): Promise<PlayFabClientModels.EmptyResponse> => {
  return new Promise<PlayFabClientModels.EmptyResponse>((resolve, reject) => {
    PlayFabClient.UnlinkOpenIdConnect(
      {
        ConnectionId,
      },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.EmptyResponse>) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      }
    );
  });
}

export const UnlinkWithGoogleAsync = (): Promise<PlayFabClientModels.UnlinkGoogleAccountResult> => {
  return new Promise<PlayFabClientModels.UnlinkGoogleAccountResult>((resolve, reject) => {
    PlayFabClient.UnlinkGoogleAccount(
      {},
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.UnlinkGoogleAccountResult>) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      }
    );
  });
}

export const UnlinkCustomIDAsync = ( CustomId: string ): Promise<PlayFabClientModels.UnlinkCustomIDResult> => {
  return new Promise<PlayFabClientModels.UnlinkCustomIDResult>((resolve, reject) => {
    PlayFabClient.UnlinkCustomID(
      { CustomId },
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.UnlinkCustomIDResult>) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      },
    );
  });
};

export const LoginWithAppleAsync = (IdentityToken: string): Promise<PlayFabClientModels.LoginResult> => {
  return new Promise<PlayFabClientModels.LoginResult>((resolve, reject) => {
    PlayFabClient.LoginWithApple(
      {
        CreateAccount: true,
        IdentityToken,
      },
      (err: PlayFabModule.IPlayFabError, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.LoginResult>) => {
        if (err) {
          return reject(err);
        }
        resolve(res.data);
      },
    );
  });
};

export const LinkWithAppleAsync = (IdentityToken: string, ForceLink: boolean = false): Promise<PlayFabClientModels.EmptyResult> => {
  return new Promise<PlayFabClientModels.EmptyResult>((resolve, reject) => {
    PlayFabClient.LinkApple(
      {
        IdentityToken,
        ForceLink,
      },
      (err: PlayFabModule.IPlayFabError, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.EmptyResult>) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
};

export const UnlinkWithAppleAsync = (): Promise<PlayFabClientModels.EmptyResponse> => {
  return new Promise<PlayFabClientModels.EmptyResponse>((resolve, reject) => {
    PlayFabClient.UnlinkApple(
      {},
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.EmptyResponse>) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      }
    );
  });
};

export const UpdateUserTitleDisplayNameAsync = (DisplayName: string): Promise<PlayFabClientModels.UpdateUserTitleDisplayNameResult> => {
  return new Promise((resolve, reject) => {
    PlayFabClient.UpdateUserTitleDisplayName(
      {
        DisplayName,
      },
      (err: PlayFabModule.IPlayFabError, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.UpdateUserTitleDisplayNameResult>) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.data);
      }
    );
  });
};

export const WriteCharacterEvent = (request: PlayFabClientModels.WriteClientCharacterEventRequest): Promise<PlayFabClientModels.WriteEventResponse> => {
  return new Promise<PlayFabClientModels.WriteEventResponse>((resolve, reject) => {
    PlayFabClient.WriteCharacterEvent(request, (error: PlayFabModule.IPlayFabError, result: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.WriteEventResponse>) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result.data);
    })
  })
}

export const WriteTitleEvent = (request: PlayFabClientModels.WriteTitleEventRequest): Promise<PlayFabClientModels.WriteEventResponse> => {
  return new Promise<PlayFabClientModels.WriteEventResponse>((resolve, reject) => {
    PlayFabClient.WriteTitleEvent(request, (error: PlayFabModule.IPlayFabError, result: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.WriteEventResponse>) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result.data);
    })
  })
}

export const WritePlayerEvent = (request: PlayFabClientModels.WriteClientPlayerEventRequest): Promise<PlayFabClientModels.WriteEventResponse> => {
  return new Promise<PlayFabClientModels.WriteEventResponse>((resolve, reject) => {
    PlayFabClient.WritePlayerEvent(request, (error: PlayFabModule.IPlayFabError, result: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.WriteEventResponse>) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result.data);
    })
  })
}

export const GetUserAccountInfoAsync = (): Promise<PlayFabClientModels.GetAccountInfoResult> => {
  return new Promise<PlayFabClientModels.GetAccountInfoResult>((resolve, reject) => {
    PlayFabClient.GetAccountInfo(
      {},
      (error, res: PlayFabModule.IPlayFabSuccessContainer<PlayFabClientModels.GetAccountInfoResult>) => {
        if (error) {
          reject(error);
          return;
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
const chalk = chalkModule.default;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    let clientDTSString = `/*
  Please do not manually edit.
*/`;
    const interfaceRegex = /^export interface (\w*?)( extends .*?)? {(.*?)\n}/gms;
    const enumRegex = /^export enum (\w*) {(.*?)\n}/gms;
    const typeRegex = /^export type (\w*) = (\w*?) ?&? ?{(.*?)}\n/gms;
    const typingsData = fs.readFileSync(typingsLocation).toString('utf-8');
    clientDTSString += typingsData;
    clientDTSString += `\n${callToPlayFabString}`;
    const clientAPICallsDirectory = `${currentDir}/src/clientHandlers/`;
    const clientFileList = fs.readdirSync(clientAPICallsDirectory);
    clientFileList.forEach((fileName) => {
        let output = fs.readFileSync(path_1.join(clientAPICallsDirectory, fileName)).toString('utf-8');
        output = output.replace(/^import .*? from ['"].*?['"];/gms, '');
        const regex = /const (.*?) = \((.*?)\): (.*?) =/gs;
        const m = regex.exec(output);
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
    clientDTSString += `\n`;
    fs.writeFileSync(outputDir, clientDTSString, { encoding: 'utf-8' });
    console.log(chalk.greenBright('Client files created and ready to compile!'));
});
init();
