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
const currentDir = process.cwd();
const chalk = chalkModule.default;
const typesLocation = `${currentDir}/src/types.ts`;
const currencyPath = `${currentDir}/config/Currency.json`;
const publicTitleDataPath = `${currentDir}/config/PublicTitleData.json`;
const internalTitleDataPath = `${currentDir}/config/InternalTitleData.json`;
const statsPath = `${currentDir}/config/Statistics.json`;
if (!fs.existsSync(typesLocation)) {
    console.log(chalk.red.bold('Types file does not exist. Skipping'));
    process.exit(0);
}
const regex = /(\/\/\/ BELOW CODE AUTO GENERATED, DO NOT TOUCH \/\/\/.*? ABOVE CODE AUTO GENERATED, DO NOT TOUCH \/\/\/)/gms;
const template = `/// BELOW CODE AUTO GENERATED, DO NOT TOUCH ///
toreplace
/// ABOVE CODE AUTO GENERATED, DO NOT TOUCH ///`;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    let typesCode = fs.readFileSync(typesLocation).toString('utf-8');
    let generatedCode = '';
    if (fs.existsSync(currencyPath)) {
        const currenciesData = JSON.parse(fs.readFileSync(currencyPath).toString('utf-8'));
        console.log(chalk.green(`Found currency data`));
        generatedCode += `
export enum PlayFabCurrencyCodes {
`;
        currenciesData.forEach(element => {
            console.log(chalk.green(`Adding ${element.CurrencyCode}`));
            generatedCode += `  ${element.CurrencyCode} = '${element.CurrencyCode}',\n`;
        });
        generatedCode += `
}`;
        generatedCode += `
export enum PlayFabCurrencyDisplayNames {
`;
        currenciesData.forEach(element => {
            generatedCode += `  ${element.CurrencyCode} = '${element.DisplayName}',\n`;
        });
        generatedCode += `
}`;
    }
    if (fs.existsSync(publicTitleDataPath)) {
        const titleData = JSON.parse(fs.readFileSync(publicTitleDataPath).toString('utf-8'));
        console.log(chalk.green('Found title data'));
        let generatedTitleType = `\nexport type PlayFabPublicTitleData = {\n`;
        Object.keys(titleData).forEach(key => {
            let keyType = titleData[key].type;
            if (typeof keyType === 'undefined') {
                keyType = 'any';
            }
            generatedTitleType += `  ${key}?: ${keyType};\n`;
        });
        generatedTitleType += `}`;
        generatedCode += generatedTitleType;
    }
    if (fs.existsSync(internalTitleDataPath)) {
        const titleData = JSON.parse(fs.readFileSync(internalTitleDataPath).toString('utf-8'));
        console.log(chalk.green('Found title data'));
        let generatedTitleType = `\nexport type PlayFabInternalTitleData = {\n`;
        Object.keys(titleData).forEach(key => {
            let keyType = titleData[key].type;
            if (typeof keyType === 'undefined') {
                keyType = 'any';
            }
            generatedTitleType += `  ${key}?: ${keyType};\n`;
        });
        generatedTitleType += `}`;
        generatedCode += generatedTitleType;
    }
    if (fs.existsSync(statsPath)) {
        const statsData = JSON.parse(fs.readFileSync(statsPath).toString('utf-8'));
        console.log(chalk.green('Found statistics data'));
        generatedCode += `
export enum PlayFabStatistics {
`;
        statsData.forEach(element => {
            console.log(chalk.green(`Adding ${element.StatisticName}`));
            generatedCode += `  ${element.StatisticName} = '${element.StatisticName}',\n`;
        });
        generatedCode += `}`;
        generatedCode += `
export const GetDefaultPlayerStats = (): {[key in PlayFabStatistics]: number} => {
  return {    
    `;
        statsData.forEach(element => {
            console.log(chalk.green(`Adding default for ${element.StatisticName}`));
            generatedCode += `  ${element.StatisticName}:${element.PlayerDefault}, \n`;
        });
        generatedCode += `
  };
};
    `;
    }
    typesCode = typesCode.replace(regex, template.replace('toreplace', generatedCode));
    fs.writeFileSync(typesLocation, typesCode, { encoding: 'utf-8' });
});
init();
