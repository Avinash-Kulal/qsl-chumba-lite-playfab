// Get the current configurations from PlayFab, sync with our
// local configurations

import * as chalkModule from 'chalk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { PlayFab, PlayFabAdmin } from 'playfab-sdk';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

const chalk = chalkModule.default;

PlayFab.settings.developerSecretKey = process.env.PF_DEVELOPER_SECRET;
PlayFab.settings.titleId = process.env.PF_TITLE_ID;

const GetPlayFabCurrencyConfigAsync = (): Promise<PlayFabAdminModels.ListVirtualCurrencyTypesResult> => {
  return new Promise<PlayFabAdminModels.ListVirtualCurrencyTypesResult>((resolve, reject) => {
    PlayFabAdmin.ListVirtualCurrencyTypes(
      {
        DeveloperPlayFabId: process.env.DEVELOPER_PF_ID,
      },
      (error, res) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

const AddVirtualCurrencyTypesAsync = (currencyContents: string): Promise<PlayFabAdminModels.BlankResult> => {
  return new Promise<PlayFabAdminModels.BlankResult>((resolve, reject) => {
    PlayFabAdmin.AddVirtualCurrencyTypes(
      {
        VirtualCurrencies: JSON.parse(currencyContents),
      },
      (error, res) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(res.data);
      },
    );
  });
};

const SetPublicTitleDataAsync = (Key: string, Value: string): Promise<PlayFabAdminModels.SetTitleDataResult> => {
  return new Promise<PlayFabAdminModels.SetTitleDataResult>((resolve, reject) => {
    PlayFabAdmin.SetTitleData({ Key, Value }, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res.data);
    });
  });
};


const SetInternalTitleDataAsync = (Key: string, Value: string): Promise<PlayFabAdminModels.SetTitleDataResult> => {
  return new Promise<PlayFabAdminModels.SetTitleDataResult>((resolve, reject) => {
    PlayFabAdmin.SetTitleInternalData({ Key, Value }, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res.data);
    });
  });
};

const UploadStatisticDefinitionsAsync = (statItem: PlayFabAdminModels.CreatePlayerStatisticDefinitionRequest) => {
  const StatisticName: string = statItem.StatisticName;
  const AggregationMethod: string = statItem.AggregationMethod;
  const VersionChangeInterval: string = statItem.VersionChangeInterval;
  return new Promise<PlayFabAdminModels.CreatePlayerStatisticDefinitionResult>((resolve, reject) => {
    PlayFabAdmin.CreatePlayerStatisticDefinition(
      {
        StatisticName,
        AggregationMethod,
        VersionChangeInterval,
      },
      (error, res) => {
        if (error) {
          if (error.error === 'StatisticNameConflict') {
            // try and update plox
            PlayFabAdmin.UpdatePlayerStatisticDefinition(
              {
                StatisticName,
                AggregationMethod,
                VersionChangeInterval,
              },
              (updateErr, updateRes) => {
                if (updateErr) {
                  console.log(chalk.red.bold(`Error when updating stat ${StatisticName}`));
                  reject(updateErr);
                }
                resolve(updateRes);
              },
            );
          } else {
            console.log(chalk.red.bold(`Error when creating stat ${StatisticName}`));
            reject(error);
          }
        } else {
          resolve(res.data);
        }
      },
    );
  });
};

// const recursivelyRemoveTypeString = (obj: any): any => {
//   delete obj['_type'];
//   Object.keys(obj).forEach(key => {
//     if (typeof obj[key] === 'object') {
//       recursivelyRemoveTypeString(obj[key]);
//     }
//   });
//   return obj;
// };

const init = async () => {
  // Get the current config...
  // Upload and publish to PlayFab
  // const currencyResult = await GetPlayFabCurrencyConfigAsync();

  // const currencyArray = currencyResult.VirtualCurrencies;
  // Put into working setup
  // const currencyMap: Map<string, PlayFabAdminModels.VirtualCurrencyData> = new Map<
  //   string,
  //   PlayFabAdminModels.VirtualCurrencyData
  // >();
  // currencyArray.map(val => {
  //   currencyMap[val.CurrencyCode] = val;
  // });
  // console.log(JSON.stringify(currencyMap, null, 2));

  // Ok, now let's read in our currency config json.
  const currencyPath = `${currentDir}/config/Currency.json`;
  const currencyContents = fs.readFileSync(currencyPath, { encoding: `utf-8` });
  // Please note, currency sync is additive ONLY, it will not remove old currencies
  await AddVirtualCurrencyTypesAsync(currencyContents);
  console.log(chalk.green(`Currencies have been updated! Please note it's additive`));
  const publicTitleDataPath = `${currentDir}/config/PublicTitleData.json`;
  const publicTitleDataContents = JSON.parse(fs.readFileSync(publicTitleDataPath, { encoding: `utf-8` }));
  // Please note, currency sync is additive ONLY, it will not remove old currencies

  const publicTitleKeys = Object.keys(publicTitleDataContents);
  for (let k = 0; k < publicTitleKeys.length; k++) {
    // Only get stuff back on errors.
    // go deep and remove the _type keys..
    // const titleDataObject = recursivelyRemoveTypeString(titleDataContents[titleKeys[k]]);
    await SetPublicTitleDataAsync(publicTitleKeys[k], JSON.stringify(publicTitleDataContents[publicTitleKeys[k]]['data']));
  }
  console.log(chalk.green('Public title data set'));

  const internalTitleDataPath = `${currentDir}/config/InternalTitleData.json`;
  const internalTitleDataContents = JSON.parse(fs.readFileSync(internalTitleDataPath, { encoding: `utf-8` }));
  // Please note, currency sync is additive ONLY, it will not remove old currencies

  const internalTitleKeys = Object.keys(internalTitleDataContents);
  for (let k = 0; k < internalTitleKeys.length; k++) {
    // Only get stuff back on errors.
    // go deep and remove the _type keys..
    // const titleDataObject = recursivelyRemoveTypeString(titleDataContents[titleKeys[k]]);
    await SetInternalTitleDataAsync(internalTitleKeys[k], JSON.stringify(internalTitleDataContents[internalTitleKeys[k]]['data']));
  }
  console.log(chalk.green('Internal title data set'));

  const statsPath = `${currentDir}/config/Statistics.json`;
  const statsPathContents = JSON.parse(fs.readFileSync(statsPath, { encoding: `utf-8` }));
  // Please note, currency sync is additive ONLY, it will not remove old currencies
  console.log(chalk.green(`Title data updated!`));
  for (const k of statsPathContents) {
    // Only get stuff back on errors.
    // first, try to create, otherwise update
    console.log(chalk.cyan(`Working on stat ${k.StatisticName}`));
    await UploadStatisticDefinitionsAsync(k);
  }
  console.log(chalk.green(`Statistics are updated`));
};

init();
