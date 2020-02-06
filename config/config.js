License Period: 17 Sep 2019 - 17 Mar 2020

#Aw==\djF8MnwxfHRydWV8MTcwOTE5LzExOjQ1OjEwLjQ3NHwxNy4wOS4yMDE5fDE3LjAz
LjIwMjB8c3ViLm5jfGRiYWxvZGlhQGdtYWlsLmNvbXxTdHVkaW8gM1QgTm9uLUNvbW1lcm
NpYWwgTGljZW5zZXxf\iHk/R6BuQEvZEnufqi+g1pZYv2hjfgUL31pM6rwy3z/QjrCCLP9
XVcUyPP/EFM7HDLf2b786bqu1R1Lz1+3qyC4pmQZ1F0vzZ9lpKlReTZ/lTfMH+98TDjp1V
2Dqod9El4nB8ZUNItllhhDXAKTHT1/gO6k7xtClzyEO3uZ7gxh8wgmaOG9zNYbeVkBBwWs
t+4yti34CTxiEWXmoHjzzms4uH88KYzA674B2ozoEwvhu2RqCzAep3AizevIiJofIsIGnK
+g5jdHLWjwj2zSaJqAB8o1B2uLoZPebIdvv7wgt8QXRfmzRXLsZHp3iZLsOJex5+6q+XWu
KTgrN/2O03w==#
---









/* eslint-disable no-undef */
import { argv } from 'yargs';
import packageFile from './../package.json';

const appName = packageFile.name;
const versionName = packageFile.version;
const port = argv.port || 3012;

const globalAppSettings = process.env.GLOBAL_APP_SETTING_PATH;
const serviceSettings = process.env.SERVICE_APP_SETTING_PATH;
const logFilePath = process.env.LOG_FILE_SETTING_PATH;

export {
    appName,
    versionName,
    port,
    globalAppSettings,
    serviceSettings,
    logFilePath,
};
