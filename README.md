# PlayFab Server Tooling

## Project Overview

A set of scripts to help with development within the PlayFab hosted environment. 

## Setup

1. In a project where the cloud code and tests will reside, install this as a dependency: `npm i --save git+https://bitbucket.org/idreaminteractive/playfab-server-tooling.git`
2. Setup your `.env` file with AT LEAST the values below.

```
PF_TITLE_ID = <develop title id>
PF_DEVELOPER_SECRET = <develop secret>
DEVELOPER_PF_ID = <PF Id of YOUR account>
```

If you need any assistance in getting up and running, please see Dave.

## Important Files

`scripts/generateServerTypes.ts`

Parses the PlayFab configuration in the host `config` folder and generates types for them. In particular, currency enums and any identified typings for the Title Data.
The `TitleData.json` needs a specific format for this. It is outlined below.

```
{
  "titleDataKey": {
    "type" : "well defined type or custom type in serverCode.ts",
    "data": <data to be uploaded to PlayFab>
  },
  "another titlekey": {
    "data": < if type is left off, the title key will be typed as 'any'>
  }
}
```

`scripts/synchronizeWithPlayFab.ts`

Finds JSON files in the host project's `config` folder to upload to PlayFab, parsing as needed.

`scripts/combineForBuild.ts`

In the host folder, there'll be a few split files in the `./src` folder, in particular, `api.ts`, `types.ts` and `utils.ts`. These files are specific and the project must be setup in this manner for now. We split these up to make programming in PlayFab a bit more sane, as at the moment you have one CloudScript file. This script will go into those files, combine and parse them properly so they can have one file and saves it into `./combined/serverCode.ts`, which is what our build + upload scripts work off of.

`scripts/uploadToPlayFab.ts`

Uploads the compiled cloud code and publishes. Use with caution - will IMMEDIATELY publish so do not use against a prod instance.

`scripts/generateClientLibs.ts`

Parses the combined source cloud code in host project and generates typings for client projects that would connect to it. Looks for any enums, interfaces, types and any method tagged with `/* Client */`. Format of the code is _VERY_ important as we use regex to get all this info, use prettier or tslint. The `tslint.json` in this directory should suffice.


If changes are made, be sure to run `npm run build` and bump the semver on `package.json`. This will enable the JS scripts to be called from importing projects to run npm scripts.