import { default as axios } from "axios";
import * as dotenv from "dotenv";
import { getBranch, validateEnv } from "./utils";

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



(async () => {
    validateEnv();
    const branch = await getBranch();

    const result: any = await deleteBranch(branch.split("\n")[0]);

    console.log(result.status);
})();