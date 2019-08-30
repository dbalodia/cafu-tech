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
