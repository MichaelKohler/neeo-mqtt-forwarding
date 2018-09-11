'use strict';

const debug = require('debug')('mk:mqttforwardig:sensorHandler');
const axios = require('axios');

const mqtt = require('./mqtt');
const config = require('./config');
const naming = require('./naming');

const SENSORS_GET_PATH = ':3000/projects/home/sensors';
const SENSORS_VALUE_PATH = ':3000/projects/home/sensorvalue';

module.exports = {
  startForwarding,
};

function startForwarding() {
  debug('Starting Forwarding..');

  getSensorURLsFromBrain()
    .then((sensors) => {
      debug('Got sensors...', sensors.length);
      registerRegularUpdate(sensors);
    });
}

function registerRegularUpdate(sensors) {
  const interval = config.getUpdateInterval();

  sensors.map((sensor) => {
    setInterval(() => {
      updateValue(sensor);
    }, interval);

    updateValue(sensor);
  });
}

function getSensorURLsFromBrain() {
  const brainIP = config.getBrainIP();
  const url = `http://${brainIP}${SENSORS_GET_PATH}`;

  return axios.get(url)
    .then((response) => response.data)
    .catch((err) => {
      console.error('FAILED_FETCHING_SENSORS', err);
    });
}

function getCurrentValue(sensor) {
  const brainIP = config.getBrainIP();
  const url = `http://${brainIP}${SENSORS_VALUE_PATH}/${sensor.eventKey}`;
  debug('Getting value for..', sensor.name, url);

  return axios.get(url)
    .then((response) => {
      return response && response.data && response.data.value;
    });
}

function updateValue(sensor) {
  debug('Updating value for..', sensor.name);

  getCurrentValue(sensor)
    .then((value) => {
      publishValue(sensor, value);
    })
    .catch(() => { /* ignore error */ });
}

function getTopicFromSensor(sensor) {
  const topicRoot = config.getMQTTTopicRoot();
  const roomName = naming.makeMQTTConform(sensor.roomName);
  const deviceName = naming.makeMQTTConform(sensor.deviceName);
  const sensorName = naming.makeMQTTConform(sensor.name);

  return `${topicRoot}${roomName}/${deviceName}/${sensorName}`;
}

function publishValue(sensor, value) {
  if (typeof value === 'undefined') {
    return;
  }

  const topic = getTopicFromSensor(sensor);

  mqtt.forwardValue(topic, value);
}