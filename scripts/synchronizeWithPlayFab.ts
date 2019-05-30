// Get the current configurations from PlayFab, sync with our
// local configurations

import * as chalkModule from 'chalk';
import * as dotenv from 'dotenv';
import { PlayFab, PlayFabAdmin } from 'playfab-sdk';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

const chalk = chalkModule.default;

PlayFab.settings.developerSecretKey = process.env.PF_DEVELOPER_SECRET;
PlayFab.settings.titleId = process.env.PF_TITLE_ID;

const AsyncGetPlayFabCurrencyConfig = (): Promise<PlayFabAdminModels.ListVirtualCurrencyTypesResult> => {
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

const init = async () => {
  // Get the current config...
  // Upload and publish to PlayFab
  const result = await AsyncGetPlayFabCurrencyConfig();

  const currencyArray = result.VirtualCurrencies;
  // Put into working setup
  const currencyMap: Map<string, PlayFabAdminModels.VirtualCurrencyData> = new Map<
    string,
    PlayFabAdminModels.VirtualCurrencyData
  >();
  currencyArray.map(val => {
    currencyMap[val.CurrencyCode] = val;
  });
  console.log(JSON.stringify(currencyMap, null, 2));
  // Ok, now let's read in our currency config json.
  PlayFabAdmin.AddVirtualCurrencyTypes({
    VirtualCurrencies:[{}]
  }, ()=>{})
};

init();
