// Take the dist server code and push it + auto publish it.
import * as chalkModule from 'chalk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { PlayFab, PlayFabAdmin } from 'playfab-sdk';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

// TODO - Fail if script dir does not exist
const scriptDir = `${currentDir}/scripts`;

// TODO - fail if we're missing environment variables
// what are our defaults?

const chalk = chalkModule.default;

PlayFab.settings.developerSecretKey = process.env.PF_DEVELOPER_SECRET;
PlayFab.settings.titleId = process.env.PF_TITLE_ID;

const AsyncUploadCC = (contents: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    PlayFabAdmin.UpdateCloudScript(
      {
        Files: [
          {
            Filename: 'main.js',
            FileContents: contents,
          },
        ],
        Publish: true,
        DeveloperPlayFabId: process.env.DEVELOPER_PF_ID,
      },
      (error, res) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(res);
      },
    );
  });
};

const init = async () => {
  // read the server code for contents
  const serverCode = fs
    .readFileSync(currentDir + '/dist/src/serverCode.js')
    .toString('utf-8');
  // Upload and publish to PlayFab
  const result = await AsyncUploadCC(serverCode);
  console.log(
    chalk.green(
      `Upload Status: ${result.status}, Revision: ${result.data.Revision}`,
    ),
  );
};

init();
