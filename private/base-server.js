// //npm modules
import path from 'path';
import express from 'express';
import SwaggerExpress from 'swagger-express-mw';
import swaggerUi from 'swagger-ui-express';
import Yaml from 'yamljs';
import uuid from 'uuid';
import cors from 'cors';
import { get as _get, isEmpty as _isEmpty, cloneDeep as _cloneDeep } from 'lodash';
import joinUrl from 'url-join';
import expressInterceptor from 'express-interceptor';
import bodyParser from 'body-parser';

// local modules
import enableAuthentication from '../private/authentication';
import { createLogger, logInfo, logError, setLoggerLevel, getLoggerLevel } from './logger';
import retrieveSettings from './configuration';
// import * as uiLogModule from './ui-logger';
import MESSAGE_CODES from './log-message-codes';
import { guessTimeZone, getOffset } from './date-util';
import { setDefaultTimeOut } from './http-client'; // instantiate http-client to include default request timeout from config

let packageFile = {};
const passOnRequestHeaders = [];
const swaggerObject = {};

// private functions
const optionsValidations = (options) => {
  let error = false;
  if (!options) {
    error = new Error('Options not defined.');
  }


  if (!options.packageFile) {
    error = new Error('packageFile is required in options parameter.');
  }

  if (!options.appRoot) {
    error = new Error('appRoot is required in options parameter.');
  }

  if (!options.port) {
    error = new Error('port is required in options parameter.');
  }

  if (error) {
    logError({
      code: MESSAGE_CODES.appFailureCode,
      message: 'Error while passing options to base server',
      error,
    });
    throw error;
  }
};


const registerBasicRoutes = (server, serviceBasePath) => {
  // Version route.
  const versionRoute = joinUrl(serviceBasePath, '/version');
  const message = `Current Version Of ${packageFile.name} is ${packageFile.version}`;
  const logLevelRoute = joinUrl(serviceBasePath, '/log/level');

  server.get(logLevelRoute, (req, res) => {
    const { value: level } = req.query;
    level && setLoggerLevel(level);
    res.send(getLoggerLevel().toString());
    res.end();
  });

  server.get(versionRoute, (req, res) => {
    res.send(message);
    res.end();
  });

  // const logRoute = joinUrl(serviceBasePath, '/log');
  // server.post(logRoute, (req, res) => {
  //   uiLogModule.writeLog(req.body).then(() => {
  //     res.send(200, { message: 'ok' });
  //   }).catch((err) => {
  //     logError({
  //       req,
  //       res,
  //       code: MESSAGE_CODES.appFailureCode,
  //       error: err,
  //     });
  //   });
  // });
};

const createCustomHeaders = (headers) => {
  if (_isEmpty(headers)) {
    logInfo({
      message: 'No Pass On Request Headers!!',
    });
    return;
  }
  const headerList = headers.split(',');
  headerList.forEach(header => passOnRequestHeaders.push(header.toLowerCase()));
};

const mapRequestHeaders = (req, res, next) => {
  const customHeaders = [];
  req.customHeaders = customHeaders;
  passOnRequestHeaders.forEach((header) => {
    const headerValue = _get(req.headers, header, '');
    if (!_isEmpty(headerValue)) {
      customHeaders.push({
        name: header,
        value: headerValue,
      });
    }
  });
  return next();
};

// For logging the incoming request - entry point logging
const requestInterceptor = (req, res, next) => {
  // log with correlation id here and if no correlation id then generate uuid here
  const reqId = _get(req, 'headers.correlationid', false) || uuid();
  req.reqId = reqId;
  res.reqId = reqId;
  req.startTime = new Date();
  logInfo({
    code: MESSAGE_CODES.appRequestCode,
    message: 'Request Received',
    req,
    correlationId: req.reqId,
    deviceInfo: true,
  });
  return next();
};

const responseInterceptor = (req, res) => ({
  // Only HTML responses will be intercepted
  isInterceptable: () => true,
  // Appends a paragraph at the end of the response body
  intercept: (body, send) => {
    send(body);
  },
  afterSend: (oldBody, newBody) => {
    const response = _cloneDeep(res);
    response.body = newBody;
    logInfo({
      code: MESSAGE_CODES.appResponseCode,
      message: 'Response Sent',
      req,
      res: response,
    });
  },
});

const registerMiddlewares = (server) => {
  server.use(cors());
};

const registerCustomMiddlewares = (server, options, serviceBasePath) => {
  const apiDocsRoute = joinUrl(serviceBasePath, '/api/docs');
  const swaggerDocument = Yaml.load('src/swagger/swagger.yaml');
  server.use(apiDocsRoute, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  server.use((req, res, next) => mapRequestHeaders(req, res, next));
  server.use(requestInterceptor);
  server.use(expressInterceptor(responseInterceptor));
  server.use(bodyParser.json({ limit: 10 * 1024 * 1024 }));
  server.use(bodyParser.raw({ limit: 10 * 1024 * 1024 }));
  enableAuthentication(server, options.allExemptedRoutes, serviceBasePath, options.publicKey);
};

// public functions
const createServer = (options, cb) => {
  try {
    optionsValidations(options);
    packageFile = _get(options, 'packageFile');
    setDefaultTimeOut(_get(options, 'requestTimeout'));
    createLogger({
      appName: packageFile.name,
      logLevel: 'info',
      logStreams: [{
        type: 'rotating-file',
        path: options.logFilePath,
        period: '2h', // 2 hour rotation
        count: 120, // keep 120 back copies
      }],
      logSrc: false,
      offset: getOffset(),
      timezone: guessTimeZone(),
      componentName: packageFile.name,
      appVersion: packageFile.version,
    });
    // create server
    const server = express();
    createCustomHeaders(options.passOnRequestHeaders);
    registerMiddlewares(server);
    SwaggerExpress.create({ appRoot: options.appRoot, swaggerFile: path.join(options.appRoot, '/src/swagger/swagger.yaml') }, (err, swaggerApp) => {
      if (err) {
        logError({
          code: MESSAGE_CODES.appFailureCode,
          error: err,
        });
        throw err;
      }
      swaggerObject.paths = _get(swaggerApp, 'runner.api.paths');
      swaggerObject.basePath = _get(swaggerApp, 'runner.api.basePath');
      const serviceBasePath = _get(swaggerApp, 'runner.swagger.basePath', '');
      //   mapSwaggerUrls(options.operationIds, swaggerObject);
      registerCustomMiddlewares(server, options, serviceBasePath);
      registerBasicRoutes(server, serviceBasePath);
      swaggerApp.register(server);
      cb().then(() => {
        server.listen(options.port, '::', () => {
          logInfo({
            code: MESSAGE_CODES.appStartCode,
            message: `${packageFile.name} started! with version ${packageFile.version}`,
          });
        });
      }).catch(error => logError({
        code: MESSAGE_CODES.appFailureCode,
        message: `${packageFile.name} can not be started`,
        error,
      }));
    });
  } catch (err) {
    logError({
      code: MESSAGE_CODES.appFailureCode,
      message: `${packageFile.name} can not be started`,
      error: err,
    });
  }
};

const loadConfigSettings = options => new Promise((resolve) => {
  if (_isEmpty(options.serviceSettingsPath) && _isEmpty(options.applicationSettingsPath)) {
    const err = new Error('Config settings can not be loaded as configuration properties file path is not specified.');
    console.log(err);
    throw err;
  }

  if (!options.configSettingMapper || !(options.configSettingMapper instanceof Function)) {
    const err = new Error('Config settings can not be mapped as config mapper function is not specified.');
    console.log(err);
    throw err;
  }

  retrieveSettings(options.serviceSettingsPath, options.applicationSettingsPath).then((data) => {
    options.configSettingMapper(data);
    resolve();
  }).catch((err) => {
    console.log(err);
    throw err;
  });
});

process.on('uncaughtException', (err) => {
  logError({
    code: MESSAGE_CODES.appFailureCode,
    message: 'Uncaught exception: ',
    error: err.stack,
  });
});

process.on('unhandledRejection', (err) => {
  logError({
    code: MESSAGE_CODES.appFailureCode,
    message: 'Uncaught rejection: ',
    error: err.stack,
  });
});

export {
  loadConfigSettings,
  createServer,
};
