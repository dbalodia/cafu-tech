import { get as _get, isEmpty as _isEmpty } from 'lodash';
import mongoose from 'mongoose';
import * as baseServer from './private/base-server';
import mapApplicationSettings from './src/message-service/helpers/appSettingsMapper';
import * as config from './config/config';
import * as appSettings from './src/message-service/vars/appSettings';
import * as packageFile from './package.json';

try {
  const connectMongo = ({ mongoUrl, newUrlParser }) => mongoose.connect(mongoUrl, newUrlParser);
  const options = {
    port: config.port,
    appRoot: __dirname,
    appName: config.appName,
    applicationSettingsPath: config.globalAppSettings,
    serviceSettingsPath: config.serviceSettings,
    configSettingMapper: mapApplicationSettings,
    packageFile,
    logFilePath: config.logFilePath,
  };

  const startupProcess = () => new Promise((resolve) => {
    resolve();
  });

  baseServer.loadConfigSettings(options).then(() => {
    options.enableLogSrc = appSettings.enableLogSrcFlag;
    options.logSeverity = appSettings.logSeverity;
    options.passOnRequestHeaders = appSettings.passOnRequestHeaders;
    options.allExemptedRoutes = _get(appSettings, 'exemptedRoutes');
    options.publicKey = _get(appSettings, 'publicKey');
    options.createRabbit = true;
    options.eventPublisherList = appSettings.eventPublisherList;
    options.eventSubscriberList = appSettings.eventSubscriberList;
    const dbConfigs = _get(appSettings, 'dbConfigs');
    const mongUrlPath = `${_get(dbConfigs, 'protocol')}://${_get(dbConfigs, 'host')}:${_get(dbConfigs, 'port')}/${_get(dbConfigs, 'dbName')}`;
    
    connectMongo({ mongoUrl: mongUrlPath, newUrlParser: { useNewUrlParser: true, useFindAndModify: false } })
      .then(() => {
        console.log('Mongoose connected to ', mongUrlPath);
        // now start server
        baseServer.createServer(options, startupProcess);
      })
      .catch((err) => {
        console.error('mongo not connected', err);
        process.exit(1);
      });
  }).catch((err) => {
    console.log('error', err);
    throw err;
  });
} catch (err) {
  console.log('error', err);
  throw err;
}

