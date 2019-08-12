import * as fs from "fs";
import * as minimist from "minimist";
import { default as axios } from "axios";
import * as envalid from "envalid";
import { str } from "envalid";
import * as dotenv from "dotenv";

const instances = ["dev", "qa", "prod"];

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

function getBranch(branch): Promise<any> {
    return new Promise((resolve, reject) => {
        return axios({
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

function updateFile(titleId: string, secret: string): Promise<any> {
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

(async () => {
    envalid.cleanEnv(process.env, {
        PF_TITLE_ID: str(),
        PF_DEVELOPER_SECRET: str(),
        INSTANCEURL: str(),
    });
    const argv = minimist(process.argv.splice(2));
    const branch = argv._[0];
    const result = await getBranch(branch.split("\n")[0]);

    if (typeof result.status !== "undefined") {
        console.log(result.status);
        process.exit();
    }

    await updateFile(result.titleId, result.secret);
})();