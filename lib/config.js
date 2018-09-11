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
  getMQTTGroup,
  getMQTTBooleanPreferenceAsNumbers,
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

function getMQTTGroup(value) {
  if (!config.mqttGroupByDataType) {
    return '';
  }

  const dataType = getDataType(value);
  return `${dataType}/`;
}

function getMQTTBooleanPreferenceAsNumbers() {
  return config.mqttUseNumbersForBooleans;
}

function getDataType(value) {
  if (
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    return typeof value;
  }

  if (
    typeof value === 'number' &&
    value % 1 === 0
  ) {
    return 'integer';
  }

  // if it wasn't an integer, we probably (?) can assume it is a float
  // if it's a number..
  if (typeof value === 'number') {
    return 'float';
  }

  return '';
}