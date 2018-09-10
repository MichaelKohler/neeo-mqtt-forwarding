'use strict';

const debug = require('debug')('mk:mqttforwardig:mqtt');
const MQTT = require('mqtt');
const config = require('./config');

const mqttURL = config.getMQTTURL();
const { username, password } = config.getMQTTCredentials();
let mqttOptions = {};
let mqttReady = false;

if (username && password) {
  mqttOptions = {
    username,
    password,
  };
}

debug('Creating client for ..', mqttURL);
const client = MQTT.connect(mqttURL, mqttOptions);

client.on('connect', () => {
  mqttReady = true;
});

client.on('error', (error) => {
  console.log(error);
});

module.exports = {
  forwardValue,
};

function forwardValue(topic, value) {
  if (!mqttReady) {
    return;
  }

  const stringifiedValue = `${value}`;

  debug('Publishing', topic, stringifiedValue);
  client.publish(topic, stringifiedValue);
}