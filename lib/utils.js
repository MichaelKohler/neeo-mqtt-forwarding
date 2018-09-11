'use strict';

const config = require('./config');

module.exports = {
  makeMQTTConform,
  handleBoolean,
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

function handleBoolean(value) {
  const treatBooleanAsNumber = config.getMQTTBooleanPreferenceAsNumbers();

  if (treatBooleanAsNumber) {
    return value ? 1 : 0;
  }

  return value;
}