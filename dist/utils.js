"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const envalid = require("envalid");
const envalid_1 = require("envalid");
function getBranch() {
    return new Promise((resolve, reject) => {
        const branch = child_process_1.execSync("git rev-parse --abbrev-ref HEAD").toString();
        resolve(branch);
    });
}
exports.getBranch = getBranch;
function validateEnv() {
    envalid.cleanEnv(process.env, {
        PF_TITLE_ID: envalid_1.str(),
        PF_DEVELOPER_SECRET: envalid_1.str(),
        INSTANCEURL: envalid_1.str(),
    });
}
exports.validateEnv = validateEnv;
