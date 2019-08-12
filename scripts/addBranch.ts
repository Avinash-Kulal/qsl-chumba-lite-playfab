import { default as axios } from 'axios';
import * as dotenv from "dotenv";
import { getBranch, validateEnv } from "./utils";

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

function addBranch(titleId: string, branch: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
        return axios({
            method: 'post',
            url: `${process.env.INSTANCEURL}/add`,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            responseType: 'json',
            data: {
                titleId,
                branch,
                secret,
            },
        })
        .then((response) => {
            resolve(response.data);
        });
    });
}


(async () => {
    validateEnv();

    const titleId: string = process.env.PF_TITLE_ID;
    const secret: string = process.env.PF_DEVELOPER_SECRET;
    const branch = await getBranch();
    const result: any = await addBranch(titleId, branch.split("\n")[0], secret);
    console.log(result.status);
})();