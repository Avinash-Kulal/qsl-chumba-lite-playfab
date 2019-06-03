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

`scripts/synchronizeWithPlayFab.ts`

Finds JSON files in the host project's `config` folder to upload to PlayFab.

`scripts/prepareJSForUpload.ts`

A parser to prep the compiled JS cloud code in case there is invalid code (like exports, other weird stuff).

`scripts/uploadToPlayFab.ts`

Uploads the compiled cloud code and publishes. Use with caution - will IMMEDIATELY publish so do not use against a prod instance.

`scripts/generateClientLibs.ts`

Parses the source cloud code in host project and generates typings for client projects that would connect to it. Looks for any enums, interfaces, types and any method tagged with `/* Client */`. Format of the code is _VERY_ important as we use regex to get all this info, use prettier or tslint. The `tslint.json` in this directory should suffice.
