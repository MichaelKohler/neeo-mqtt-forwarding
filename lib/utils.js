'use strict';

const _flow = require('lodash.flow');

const config = require('./config');

module.exports = {
  makeMQTTConform,
  getMQTTGroup,
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

function getMQTTGroup(value) {
  if (!config.getMQTTGroupingPreference()) {
    return '';
  }

  const dataType = getDataType(value);
  return `${dataType}/`;
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