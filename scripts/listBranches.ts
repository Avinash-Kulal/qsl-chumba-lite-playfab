import { default as axios } from 'axios';
import * as dotenv from "dotenv";
import { getBranch, validateEnv } from "./utils";

// Setup environment to look at the calling dir.
const currentDir = process.cwd();

dotenv.config({
  path: `${currentDir}/.env`,
});

function getAll(): Promise<any> {
    return new Promise((resolve, reject) => {
        return axios({
            method: 'get',
            url: `${process.env.INSTANCEURL}`,
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

(async () => {
    validateEnv();

    const result = await getAll();
    let branches: string[] = [];

    for (const res of result) {
        branches.push(res.branch);
    }

    console.log(branches);
})();