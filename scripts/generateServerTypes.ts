// Run through our types and inject them into the server code.

import * as chalkModule from 'chalk';
import * as fs from 'fs';

// Setup environment to look at the calling dir.
const currentDir = process.cwd();
const chalk = chalkModule.default;

// const serverScriptLocation = `${currentDir}/src/serverCode.ts`;
const typesLocation = `${currentDir}/src/types.ts`
const currencyPath = `${currentDir}/config/Currency.json`;
const titleDataPath = `${currentDir}/config/TitleData.json`;
const statsPath = `${currentDir}/config/Statistics.json`;

if (!fs.existsSync(typesLocation)) {
  console.log(chalk.red.bold('Types file does not exist. Skipping'));
  process.exit(0);
}

// Ok, file exists. Let's clear out the CURRENT types that are there.

const regex = /(\/\/\/ BELOW CODE AUTO GENERATED, DO NOT TOUCH \/\/\/.*? ABOVE CODE AUTO GENERATED, DO NOT TOUCH \/\/\/)/gms;

// replace this...
const template = `
/// BELOW CODE AUTO GENERATED, DO NOT TOUCH ///
toreplace
/// ABOVE CODE AUTO GENERATED, DO NOT TOUCH ///
`;

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
      generatedCode += `${element.CurrencyCode} = '${element.CurrencyCode}',\n`;
    });
    generatedCode += `
}`;
    generatedCode += `
export enum PlayFabCurrencyDisplayNames {
`;
    currenciesData.forEach(element => {
      generatedCode += `${element.CurrencyCode} = '${element.DisplayName}',\n`;
    });
    generatedCode += `
}`;
  }

  // Title Data
  if (fs.existsSync(titleDataPath)) {
    const titleData: { [key: string]: any } = JSON.parse(fs.readFileSync(titleDataPath).toString('utf-8'));
    // ok. lets gen our stuff.
    console.log(chalk.green('Found title data'));
    let generatedTitleType = `\nexport interface PlayFabTitleData {\n`;
    Object.keys(titleData).forEach(key => {
      let keyType: string = titleData[key]['type'];
      if (typeof keyType === 'undefined') {
        keyType = 'any';
      }
      generatedTitleType += `${key}?: ${keyType};\n`;
      // const objType = typeof titleData[key];
      // if (objType === 'string') {
      //   generatedTitleType += `${key}?: string;\n`;
      // } else if (objType === 'number') {
      //   generatedTitleType += `${key}?: number;\n`;
      // } else if (objType === 'boolean') {
      //   generatedTitleType += `${key}?: boolean;\n`;
      // } else {
      //   // We COULD dive further, but i feel like we can
      //   // cast to a custom type if needed here.
      //   if (Array.isArray(titleData[key])) {
      //     // tis an array
      //     generatedTitleType += `${key}?: any[];\n`;
      //   } else {
      //     // gen our custom internal type ehre
      //     // const { objCode, objTypeName } = getObjectNameAndCode('TitleData', key, titleData[key]);

      //     // generatedCode += objCode;
      //     // generatedTitleType += `${key}?: ${objTypeName};\n`;
      //     generatedTitleType += `${key}?: any;\n`;
      //   }
      // }
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
      generatedCode += `${element.StatisticName} = '${element.StatisticName}',\n`;
    });
    generatedCode += `
}`;
  }

  // Upload and publish to PlayFab
  typesCode = typesCode.replace(regex, template.replace('toreplace', generatedCode));
  fs.writeFileSync(typesLocation, typesCode, { encoding: 'utf-8' });
};

// const getObjectNameAndCode = (prefix: string, objKey: string, obj: any): { objTypeName: string; objCode: string } => {
//   const objTypeName = `${prefix}${objKey}`;
//   let extraTypes = '';
//   let objCode = `\ninterface ${objTypeName} {\n`;
//   Object.keys(obj).forEach(key => {
//     const objType = typeof obj[key];
//     if (objType === 'string') {
//       objCode += `${key}?: string;\n`;
//     } else if (objType === 'number') {
//       objCode += `${key}?: number;\n`;
//     } else if (objType === 'boolean') {
//       objCode += `${key}?: boolean;\n`;
//     } else {
//       // We COULD dive further, but i feel like we can
//       // cast to a custom type if needed here.
//       if (Array.isArray(obj[key])) {
//         // tis an array
//         objCode += `${key}?: any[];\n`;
//       } else {
//         // gen our custom internal type ehre
//         const data = getObjectNameAndCode(objTypeName, key, obj[key]);
//         console.log(data);
//         extraTypes += data.objCode;
//         objCode += `${key}?: ${data.objTypeName};\n`;
//       }
//     }
//   });
//   objCode += `}\n`;
//   objCode = extraTypes + objCode;
//   return {
//     objTypeName,
//     objCode,
//   };
// };

init();
