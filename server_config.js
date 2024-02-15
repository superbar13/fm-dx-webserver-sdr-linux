/* Libraries / Imports */
const fs = require('fs');
const { logDebug, logError, logInfo, logWarn } = require('./console');

let configName = 'config';

const index = process.argv.indexOf('--config');
if (index !== -1 && index + 1 < process.argv.length) {
  configName = process.argv[index + 1];
  logInfo('Loading with a custom config file:', configName + '.json')
}

let serverConfig = {
  webserver: {
    webserverIp: "0.0.0.0",
    webserverPort: "8080",
    audioPort: "8081"
  },
  xdrd: {
    xdrdIp: "127.0.0.1",
    xdrdPort: "7373",
    xdrdPassword: ""
  },
  audio: {
    audioDevice: "Microphone (High Definition Audio Device)",
    audioChannels: 2,
    audioBitrate: "128k"
  },
  identification: {
    token: null,
    tunerName: "",
    tunerDesc: "",
    lat: "0",
    lon: "0",
    broadcastTuner: false,
    proxyIp: "",
  },
  password: {
    tunePass: "",
    adminPass: ""
  },
  publicTuner: true,
  lockToAdmin: false,
  autoShutdown: false,
};

function deepMerge(target, source)
{
  Object.keys(source).forEach(function(key) {
    if (typeof target[key] === 'object' && target[key] !== null) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  });
}

function configUpdate(newConfig) {
  deepMerge(serverConfig, newConfig);
}

function configSave() {
  fs.writeFile(configName + '.json', JSON.stringify(serverConfig, null, 2), (err) => {
    if (err) {
      logError(err);
    } else {
      logInfo('Server config saved successfully.');
    }
  });
}

if (fs.existsSync(configName + '.json')) {
  const configFileContents = fs.readFileSync(configName + '.json', 'utf8');
  serverConfig = JSON.parse(configFileContents);
}

module.exports = {
    configName, serverConfig, configUpdate, configSave
};