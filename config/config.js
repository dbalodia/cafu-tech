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


/*#==\djF8MnwxfHRydWV8MjAwMjIwLzA3OjI1OjQ5LjY0MHwyMC4wMi4yMDIwfDIwLjA4
LjIwMjB8c3ViLm5jfGdhcmdhbmtpdDAwOTVAZ21haWwuY29tfFN0dWRpbyAzVCBOb24tQ2
9tbWVyY2lhbCBMaWNlbnNlfF8=\YyoOCIEU5YNcljfAy9D8g4X0aDD+Ngvy3g6WrGbSicm
17O08+P+5EGwRf1ehax5FvN9vWhVrGnEeVqnaTBHREyJgFqkhtXACKM7lEAQVsmOVizVp4
sHGRpQ37EG5Zzz8ojkNSZ1fxN4cp9gDXCcgfrNU2DiSkPdb5dMVH0CJamZv7pzC6Y6QMsC
QyCJHpMT62ItT0dlSpN470e1yCyq3DmAF2yIu7Uz6q4PM69r7P3ItKIq3+3+2Y540bddl3
oTllB5FWjD/1rmORx1M9TIXQujIr7DXvlEw1gWOI8wTScfg6yFCC1d1oMuCalRctS6eh4f
MSgP0oBzpXBNPXSi6EQ==#
---
*/
