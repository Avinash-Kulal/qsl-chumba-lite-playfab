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
const axios_1 = require("axios");
const child_process_1 = require("child_process");
const dotenv = require("dotenv");
const envalid = require("envalid");
const envalid_1 = require("envalid");
const currentDir = process.cwd();
dotenv.config({
    path: `${currentDir}/.env`,
});
function deleteBranch(branch) {
    return new Promise((resolve, reject) => {
        return axios_1.default({
            method: 'post',
            url: `${process.env.INSTANCEURL}/delete`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            responseType: 'json',
            data: {
                branch,
            },
        })
            .then((response) => {
            resolve(response.data);
        });
    });
}
function getBranch() {
    return new Promise((resolve, reject) => {
        const branch = child_process_1.execSync("git rev-parse --abbrev-ref HEAD").toString();
        resolve(branch);
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    envalid.cleanEnv(process.env, {
        PF_TITLE_ID: envalid_1.str(),
        PF_DEVELOPER_SECRET: envalid_1.str(),
        INSTANCEURL: envalid_1.str(),
    });
    const branch = yield getBranch();
    const result = yield deleteBranch(branch.split("\n")[0]);
    console.log(result.status);
}))();
