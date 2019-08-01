import * as chalkModule from 'chalk';
import * as fs from 'fs';
// Run through our types and inject them into the server code.


// Setup environment to look at the calling dir.
const currentDir = process.cwd();
const chalk = chalkModule.default;

// const serverScriptLocation = `${currentDir}/src/serverCode.ts`;
const typesLocation = `${currentDir}/src/types.ts`;
const currencyPath = `${currentDir}/config/Currency.json`;
const publicTitleDataPath = `${currentDir}/config/PublicTitleData.json`;
const internalTitleDataPath = `${currentDir}/config/InternalTitleData.json`;
const statsPath = `${currentDir}/config/Statistics.json`;

if (!fs.existsSync(typesLocation)) {
  console.log(chalk.red.bold('Types file does not exist. Skipping'));
  process.exit(0);
}

// Ok, file exists. Let's clear out the CURRENT types that are there.

const regex = /(\/\/\/ BELOW CODE AUTO GENERATED, DO NOT TOUCH \/\/\/.*? ABOVE CODE AUTO GENERATED, DO NOT TOUCH \/\/\/)/gms;

// replace this...
const template = `/// BELOW CODE AUTO GENERATED, DO NOT TOUCH ///
toreplace
/// ABOVE CODE AUTO GENERATED, DO NOT TOUCH ///`;

const init = async () => {
  // read the server code for contents
  let typesCode = fs.readFileSync(typesLocation).toString('utf-8');
  let generatedCode = '';
  // read our currencies + auto gen them
  if (fs.existsSync(currencyPath)) {
    // gen types for currencies
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

  // Public Title Data

  if (fs.existsSync(publicTitleDataPath)) {
    const titleData: { [key: string]: any } = JSON.parse(fs.readFileSync(publicTitleDataPath).toString('utf-8'));
    // ok. lets gen our stuff.
    console.log(chalk.green('Found title data'));
    let generatedTitleType = `\nexport interface PlayFabPublicTitleData {\n`;
    Object.keys(titleData).forEach(key => {
      let keyType: string = titleData[key].type;
      if (typeof keyType === 'undefined') {
        keyType = 'any';
      }
      generatedTitleType += `  ${key}?: ${keyType};\n`;
    });
    generatedTitleType += `}`;
    generatedCode += generatedTitleType;
  }


  if (fs.existsSync(internalTitleDataPath)) {
    const titleData: { [key: string]: any } = JSON.parse(fs.readFileSync(internalTitleDataPath).toString('utf-8'));
    // ok. lets gen our stuff.
    console.log(chalk.green('Found title data'));
    let generatedTitleType = `\nexport interface PlayFabInternalTitleData {\n`;
    Object.keys(titleData).forEach(key => {
      let keyType: string = titleData[key].type;
      if (typeof keyType === 'undefined') {
        keyType = 'any';
      }
      generatedTitleType += `  ${key}?: ${keyType};\n`;
    });
    generatedTitleType += `}`;
    generatedCode += generatedTitleType;
  }

  if (fs.existsSync(statsPath)) {
    const statsData: any[] = JSON.parse(fs.readFileSync(statsPath).toString('utf-8'));
    // ok. lets gen our stuff.
    console.log(chalk.green('Found statistics data'));
    generatedCode += `
export enum PlayFabStatistics {
`;
    statsData.forEach(element => {
      console.log(chalk.green(`Adding ${element.StatisticName}`));
      generatedCode += `  ${element.StatisticName} = '${element.StatisticName}',\n`;
    });
    generatedCode += `}`;

    // also add an object based on enum w/ defaults
    // first, write our type
  
    // now, setup our const obj
    generatedCode += `
export const DefaultPlayerStats: {[key in PlayFabStatistics]: number} = {    
    `
    // fill this w/ our defaults
    statsData.forEach(element => {
      console.log(chalk.green(`Adding default for ${element.StatisticName}`));
      generatedCode += `  ${element.StatisticName}:${element.PlayerDefault}, \n`;
    });

    generatedCode += `
}
    `
  }

  // Upload and publish to PlayFab
  typesCode = typesCode.replace(regex, template.replace('toreplace', generatedCode));
  fs.writeFileSync(typesLocation, typesCode, { encoding: 'utf-8' });
};

init();
