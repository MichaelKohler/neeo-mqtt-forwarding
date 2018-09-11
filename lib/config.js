'use strict';

const debug = require('debug')('mk:mqttforwardig:config');

const DEFAULT_INTERVAL = 60000;

let config;

try {
  config = require('../config.json');
} catch (err) {
  console.error('Could not load "config.json" file. Did you copy the sample and adjust it?');
  process.exit(1);
}

if (!config.brainIP || !config.mqttURL) {
  console.error('You need to provide "brainIP" and "mqttURL" in the config..');
}

module.exports = {
  getBrainIP,
  getActivation,
  getMQTTURL,
  getUpdateInterval,
  getMQTTTopicRoot,
  getMQTTCredentials,
  getMQTTBooleanPreferenceAsNumbers,
  getMQTTGroupingPreference,
};

function getBrainIP() {
  debug('Getting brain IP..');
  return config.brainIP;
}

function getMQTTURL() {
  const url = config.mqttURL;
  debug('Getting MQTT URL..', url);

  return url;
}

function getMQTTTopicRoot() {
  return config.mqttTopicRoot || '';
}

function getMQTTCredentials() {
  return {
    username: config.mqttUsername || '',
    password: config.mqttPassword || '',
  };
}

function getUpdateInterval() {
  return config.updateIntervalInMs || DEFAULT_INTERVAL;
}

function getActivation() {
  return [config.forwardSensorValues, config.forwardActiveRecipes];
}

function getMQTTBooleanPreferenceAsNumbers() {
  return config.mqttUseNumbersForBooleans;
}

function getMQTTGroupingPreference() {
  return config.mqttGroupByDataType;
}