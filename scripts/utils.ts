import { execSync } from "child_process";
import * as envalid from "envalid";
import { str } from "envalid";

export function getBranch(): Promise<string> {
    return new Promise((resolve, reject) => {
        const branch: string = execSync("git rev-parse --abbrev-ref HEAD").toString();
        resolve(branch);
    });
}

export function validateEnv(): void {
    envalid.cleanEnv(process.env, {
        PF_TITLE_ID: str(),
        PF_DEVELOPER_SECRET: str(),
        INSTANCEURL: str(),
    });
}