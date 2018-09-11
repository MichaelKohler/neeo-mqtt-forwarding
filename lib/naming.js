'use strict';

module.exports = {
  makeMQTTConform,
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