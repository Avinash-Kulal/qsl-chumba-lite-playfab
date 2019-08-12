import { default as axios } from "axios";
import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as envalid from "envalid";
import { str } from "envalid";

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});


function deleteBranch(branch: string): Promise<any> {
    return new Promise((resolve, reject) => {
        return axios({
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

function getBranch(): Promise<string> {
    return new Promise((resolve, reject) => {
        const branch: string = execSync("git rev-parse --abbrev-ref HEAD").toString();
        resolve(branch);
    });
}



(async () => {
    envalid.cleanEnv(process.env, {
        PF_TITLE_ID: str(),
        PF_DEVELOPER_SECRET: str(),
        INSTANCEURL: str(),
    });
    const branch = await getBranch();

    const result: any = await deleteBranch(branch.split("\n")[0]);

    console.log(result.status);
})();