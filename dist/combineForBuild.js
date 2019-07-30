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
const currentDir = process.cwd();
const chalk = chalkModule.default;
const typesLocation = `${currentDir}/src/types.ts`;
const utilsLocation = `${currentDir}/src/utils.ts`;
const apiLocation = `${currentDir}/src/api.ts`;
const combinedFileLocation = `${currentDir}/combined/serverCode.ts`;
if (!fs.existsSync(typesLocation) ||
    !fs.existsSync(utilsLocation) ||
    !fs.existsSync(apiLocation)) {
    console.log(chalk.red.bold('Missing files for combine. Please check and ensure you have all files setup'));
    process.exit(0);
}
if (!fs.existsSync(`${currentDir}/combined/`)) {
    console.log(chalk.red.bold('Please create a `combined` folder'));
    process.exit(0);
}
const init = () => __awaiter(this, void 0, void 0, function* () {
    let serverCodeOutput = fs.readFileSync(apiLocation).toString('utf-8');
    serverCodeOutput = serverCodeOutput.replace(/^import .*/gm, '');
    let utilsContent = fs.readFileSync(utilsLocation).toString('utf-8');
    utilsContent = utilsContent.replace(/^import .*/gm, '');
    utilsContent = utilsContent.replace(/^export /gm, '');
    serverCodeOutput += `\n${utilsContent}`;
    let typesContent = fs.readFileSync(typesLocation).toString('utf-8');
    typesContent = typesContent.replace(/^import .*/gm, '');
    typesContent = typesContent.replace(/^export /gm, '');
    serverCodeOutput += `\n${typesContent}`;
    fs.writeFileSync(combinedFileLocation, serverCodeOutput, {
        encoding: 'utf-8'
    });
    console.log(chalk.green.bold(`Files combined, ready for build + uploading`));
});
init();
