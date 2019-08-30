import yaml from 'js-yaml';
import fs from 'fs';
import { isEmpty as _isEmpty, merge as _merge } from 'lodash';

const retrieveSettings = (servicePropertiesPath, globalPropertiesPath) => new Promise((resolve, reject) => {
  let config;
  let applicationConfig;
  let serviceConfig;
  try {
    if (_isEmpty(globalPropertiesPath)) {
      console.log('Unable to find global properties but still going ahead');
    } else {
      applicationConfig = yaml.safeLoad(fs.readFileSync(globalPropertiesPath));
      console.log('Successfully read the application file ', globalPropertiesPath);
    }

    if (_isEmpty(servicePropertiesPath)) {
      console.log('Unable to find service properties but still going ahead');
    } else {
      serviceConfig = yaml.safeLoad(fs.readFileSync(servicePropertiesPath));
      console.log('Successfully read the service file ', servicePropertiesPath);
    }
    config = _merge(applicationConfig, serviceConfig); // merging application & service files.
    console.log('Final Configuration of service ', config);
    resolve(config);
  } catch (err) {
    reject(err);
  }
});

export default retrieveSettings;
