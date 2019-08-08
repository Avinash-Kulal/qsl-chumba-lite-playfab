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
const path_1 = require("path");
const currentDir = process.cwd();
const chalk = chalkModule.default;
const typesLocation = `${currentDir}/src/types.ts`;
const utilsLocation = `${currentDir}/src/utils.ts`;
const constantsLocation = `${currentDir}/src/constants.ts`;
const clientAPICallsDirectory = `${currentDir}/src/clientHandlers/`;
const qaAPICallsDirectory = `${currentDir}/src/qaHandlers/`;
const combinedFileLocation = `${currentDir}/combined/serverCode.ts`;
if (!fs.existsSync(typesLocation) ||
    !fs.existsSync(utilsLocation)) {
    console.log(chalk.red.bold('Missing files for combine. Please check and ensure you have all files setup'));
    process.exit(0);
}
if (!fs.existsSync(clientAPICallsDirectory)) {
    console.log(chalk.red.bold('Missing client API calls dir!'));
    process.exit(0);
}
if (!fs.existsSync(`${currentDir}/combined/`)) {
    console.log(chalk.red.bold('Combined folder does not exist, creating one for you'));
    fs.mkdirSync(`${currentDir}/combined/`);
}
const init = () => __awaiter(this, void 0, void 0, function* () {
    let apiOutput = '';
    let constantsContent = fs.readFileSync(constantsLocation).toString('utf-8');
    constantsContent = constantsContent.replace(/^import .*? from '.*?';/gms, '');
    constantsContent = constantsContent.replace(/^export /gm, '');
    apiOutput += constantsContent;
    let utilsContent = fs.readFileSync(utilsLocation).toString('utf-8');
    utilsContent = utilsContent.replace(/^import .*? from '.*?';/gms, '');
    utilsContent = utilsContent.replace(/^export /gm, '');
    apiOutput += utilsContent;
    let typesContent = fs.readFileSync(typesLocation).toString('utf-8');
    typesContent = typesContent.replace(/^import .*? from '.*?';/gms, '');
    typesContent = typesContent.replace(/^export /gm, '');
    apiOutput += typesContent;
    const clientFileList = fs.readdirSync(clientAPICallsDirectory);
    clientFileList.forEach((fileName) => {
        console.log(path_1.join(clientAPICallsDirectory, fileName));
        let output = fs.readFileSync(path_1.join(clientAPICallsDirectory, fileName)).toString('utf-8');
        output = output.replace(/^import .*? from ['"].*?['"];/gms, '');
        const regex = /^const (.*?) = \(/gm;
        const match = regex.exec(output);
        const handlerName = match[1];
        output += `\nhandlers.${handlerName} = ${handlerName};`;
        apiOutput += output;
    });
    const qaFileList = fs.readdirSync(qaAPICallsDirectory);
    qaFileList.forEach((fileName) => {
        console.log(path_1.join(qaAPICallsDirectory, fileName));
        let output = fs.readFileSync(path_1.join(qaAPICallsDirectory, fileName)).toString('utf-8');
        output = output.replace(/^import .*? from ['"].*?['"];/gms, '');
        const regex = /^const (.*?) = \(/gm;
        const match = regex.exec(output);
        const handlerName = match[1];
        output += `\nhandlers.${handlerName} = ${handlerName};`;
        apiOutput += output;
    });
    fs.writeFileSync(combinedFileLocation, apiOutput, {
        encoding: 'utf-8'
    });
    console.log(chalk.green.bold(`Files combined, ready for build + uploading`));
});
init();
