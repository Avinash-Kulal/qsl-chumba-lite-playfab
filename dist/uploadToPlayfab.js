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
const dotenv = require("dotenv");
const fs = require("fs");
const playfab_sdk_1 = require("playfab-sdk");
const currentDir = process.cwd();
dotenv.config({
    path: `${currentDir}/.env`,
});
const scriptDir = `${currentDir}/scripts`;
const chalk = chalkModule.default;
playfab_sdk_1.PlayFab.settings.developerSecretKey = process.env.PF_DEVELOPER_SECRET;
playfab_sdk_1.PlayFab.settings.titleId = process.env.PF_TITLE_ID;
const AsyncUploadCC = (contents) => {
    return new Promise((resolve, reject) => {
        playfab_sdk_1.PlayFabAdmin.UpdateCloudScript({
            Files: [
                {
                    Filename: 'main.js',
                    FileContents: contents,
                },
            ],
            Publish: true,
            DeveloperPlayFabId: process.env.DEVELOPER_PF_ID,
        }, (error, res) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(res);
        });
    });
};
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const serverCode = fs
        .readFileSync(currentDir + '/dist/serverCode.js')
        .toString('utf-8');
    const result = yield AsyncUploadCC(serverCode);
    console.log(chalk.green(`Upload Status: ${result.status}, Revision: ${result.data.Revision}`));
});
init();
