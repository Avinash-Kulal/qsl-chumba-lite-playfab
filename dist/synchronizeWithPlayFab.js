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
const chalk = chalkModule.default;
playfab_sdk_1.PlayFab.settings.developerSecretKey = process.env.PF_DEVELOPER_SECRET;
playfab_sdk_1.PlayFab.settings.titleId = process.env.PF_TITLE_ID;
const GetPlayFabCurrencyConfigAsync = () => {
    return new Promise((resolve, reject) => {
        playfab_sdk_1.PlayFabAdmin.ListVirtualCurrencyTypes({
            DeveloperPlayFabId: process.env.DEVELOPER_PF_ID,
        }, (error, res) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(res.data);
        });
    });
};
const AddVirtualCurrencyTypesAsync = (currencyContents) => {
    return new Promise((resolve, reject) => {
        playfab_sdk_1.PlayFabAdmin.AddVirtualCurrencyTypes({
            VirtualCurrencies: JSON.parse(currencyContents),
        }, (error, res) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(res.data);
        });
    });
};
const SetPublicTitleDataAsync = (Key, Value) => {
    return new Promise((resolve, reject) => {
        playfab_sdk_1.PlayFabAdmin.SetTitleData({ Key, Value }, (error, res) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(res.data);
        });
    });
};
const SetInternalTitleDataAsync = (Key, Value) => {
    return new Promise((resolve, reject) => {
        playfab_sdk_1.PlayFabAdmin.SetTitleInternalData({ Key, Value }, (error, res) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            resolve(res.data);
        });
    });
};
const UploadStatisticDefinitionsAsync = (statItem) => {
    const StatisticName = statItem.StatisticName;
    const AggregationMethod = statItem.AggregationMethod;
    const VersionChangeInterval = statItem.VersionChangeInterval;
    return new Promise((resolve, reject) => {
        playfab_sdk_1.PlayFabAdmin.CreatePlayerStatisticDefinition({
            StatisticName,
            AggregationMethod,
            VersionChangeInterval,
        }, (error, res) => {
            if (error) {
                if (error.error === 'StatisticNameConflict') {
                    playfab_sdk_1.PlayFabAdmin.UpdatePlayerStatisticDefinition({
                        StatisticName,
                        AggregationMethod,
                        VersionChangeInterval,
                    }, (updateErr, updateRes) => {
                        if (updateErr) {
                            console.log(chalk.red.bold(`Error when updating stat ${StatisticName}`));
                            reject(updateErr);
                        }
                        resolve(updateRes);
                    });
                }
                else {
                    console.log(chalk.red.bold(`Error when creating stat ${StatisticName}`));
                    reject(error);
                }
            }
            else {
                resolve(res.data);
            }
        });
    });
};
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const currencyPath = `${currentDir}/config/Currency.json`;
    const currencyContents = fs.readFileSync(currencyPath, { encoding: `utf-8` });
    yield AddVirtualCurrencyTypesAsync(currencyContents);
    console.log(chalk.green(`Currencies have been updated! Please note it's additive`));
    const publicTitleDataPath = `${currentDir}/config/PublicTitleData.json`;
    const publicTitleDataContents = JSON.parse(fs.readFileSync(publicTitleDataPath, { encoding: `utf-8` }));
    const publicTitleKeys = Object.keys(publicTitleDataContents);
    for (let k = 0; k < publicTitleKeys.length; k++) {
        yield SetPublicTitleDataAsync(publicTitleKeys[k], JSON.stringify(publicTitleDataContents[publicTitleKeys[k]]['data']));
    }
    console.log(chalk.green('Public title data set'));
    const internalTitleDataPath = `${currentDir}/config/InternalTitleData.json`;
    const internalTitleDataContents = JSON.parse(fs.readFileSync(internalTitleDataPath, { encoding: `utf-8` }));
    const internalTitleKeys = Object.keys(internalTitleDataContents);
    for (let k = 0; k < internalTitleKeys.length; k++) {
        yield SetInternalTitleDataAsync(internalTitleKeys[k], JSON.stringify(internalTitleDataContents[internalTitleKeys[k]]['data']));
    }
    console.log(chalk.green('Internal title data set'));
    const statsPath = `${currentDir}/config/Statistics.json`;
    const statsPathContents = JSON.parse(fs.readFileSync(statsPath, { encoding: `utf-8` }));
    console.log(chalk.green(`Title data updated!`));
    for (const k of statsPathContents) {
        console.log(chalk.cyan(`Working on stat ${k.StatisticName}`));
        yield UploadStatisticDefinitionsAsync(k);
    }
    console.log(chalk.green(`Statistics are updated`));
});
init();
