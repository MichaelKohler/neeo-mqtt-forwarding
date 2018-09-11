'use strict';

const _flow = require('lodash.flow');

const config = require('./config');

module.exports = {
  makeMQTTConform,
  transformValue,
};

function makeMQTTConform(name) {
  return name
    .replace(/\s/g, '-')
    .replace(/\+/g, '-')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/#/g, '')
  ;
}

const transform = _flow([
  handleBoolean,
  handleStringAsFloat,
]);

function transformValue(value) {
  return transform(value);
}

function handleBoolean(value) {
  if (typeof value !== 'boolean') {
    return value;
  }

  const treatBooleanAsNumber = config.getMQTTBooleanPreferenceAsNumbers();

  if (treatBooleanAsNumber) {
    return value ? 1 : 0;
  }

  return value;
}

function handleStringAsFloat(value) {
  if (typeof value !== 'string') {
    return value;
  }

  let floatNumber;

  try {
    floatNumber = parseFloat(value);
  } catch(err) {
    return value;
  }

  return floatNumber;
}