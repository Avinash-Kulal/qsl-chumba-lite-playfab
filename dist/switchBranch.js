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
const fs = require("fs");
const minimist = require("minimist");
const axios_1 = require("axios");
const utils_1 = require("./utils");
const dotenv = require("dotenv");
const instances = ["dev", "qa", "prod"];
const currentDir = process.cwd();
dotenv.config({
    path: `${currentDir}/.env`,
});
function getBranch(branch) {
    return new Promise((resolve, reject) => {
        return axios_1.default({
            method: 'get',
            url: `${process.env.INSTANCEURL}/${branch}`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            responseType: 'json',
        })
            .then((response) => {
            resolve(response.data);
        });
    });
}
function updateFile(titleId, secret) {
    return new Promise((resolve, reject) => {
        fs.readFile(".env", "utf8", (err, data) => {
            if (err) {
                throw err;
            }
            const titleIdRegex = /PF_TITLE_ID\s\=\s[a-zA-Z0-9]*/g;
            const secretRegex = /PF_DEVELOPER_SECRET\s\=\s[a-zA-Z0-9]*/g;
            data = data.replace(titleIdRegex, `PF_TITLE_ID = ${titleId}`);
            data = data.replace(secretRegex, `PF_DEVELOPER_SECRET = ${secret}`);
            fs.writeFile(".env", data, 'utf8', (err) => {
                if (err) {
                    throw err;
                }
                console.log('Env file has been updated');
                resolve();
            });
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    utils_1.validateEnv();
    const argv = minimist(process.argv.splice(2));
    const branch = argv._[0];
    const result = yield getBranch(branch.split("\n")[0]);
    if (typeof result.status !== "undefined") {
        console.log(result.status);
        process.exit();
    }
    yield updateFile(result.titleId, result.secret);
}))();
