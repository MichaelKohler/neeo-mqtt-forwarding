'use strict';

const debug = require('debug')('mk:mqttforwardig:recipeHandler');
const axios = require('axios');

const mqtt = require('./mqtt');
const config = require('./config');
const utils = require('./utils');

const PROJECT_GET_PATH = ':3000/projects/home/';
const ACTIVE_RECIPE_GET_PATH = ':3000/projects/home/activescenariokeys';

module.exports = {
  startForwarding,
};

function startForwarding() {
  debug('Starting Forwarding..');

  registerRegularUpdate();
}

function registerRegularUpdate() {
  const interval = config.getUpdateInterval();

  setInterval(() => {
    getActiveRecipes();
  }, interval);

  getActiveRecipes();
}

function getActiveRecipes() {
  Promise.all([
    getActiveRecipesFromBrain(),
    getScenariosFromBrain(),
  ])
    .then(([activeRecipesKeys, scenarios]) => {
      debug('Got active recipes', activeRecipesKeys);
      const mappedActiveRecipes = activeRecipesKeys.map((key) => {
        return scenarios.find((scenario) => {
          return scenario.key === key;
        });
      }).filter(Boolean);

      mappedActiveRecipes.map(publishValue);
    })
    .catch(() => { /* already handled */ });
}

function getScenariosFromBrain() {
  const brainIP = config.getBrainIP();
  const url = `http://${brainIP}${PROJECT_GET_PATH}`;

  return axios.get(url)
    .then((response) => response.data)
    .then(getScenarioInfos)
    .catch((err) => {
      console.error('FAILED_FETCHING_PROJECT', err);
      throw err;
    });
}

function getScenarioInfos(project) {
  return Object.values(project.rooms).reduce((scenarios, room) => {
    const scenarioInfos = Object.values(room.scenarios).map((scenario) => ({
      key: scenario.key,
      name: scenario.name,
      roomName: scenario.roomName,
    }));

    const allScenarios = scenarios.concat(scenarioInfos);
    return allScenarios;
  }, []);
}

function getActiveRecipesFromBrain() {
  const brainIP = config.getBrainIP();
  const url = `http://${brainIP}${ACTIVE_RECIPE_GET_PATH}`;

  return axios.get(url)
    .then((response) => response.data)
    .catch((err) => {
      console.error('FAILED_FETCHING_ACTIVE_RECIPES', err);
      throw err;
    });
}

function getTopicForActiveRecipe(recipe, value) {
  const topicRoot = config.getMQTTTopicRoot();
  const group = utils.getMQTTGroup(value);
  const name = utils.makeMQTTConform(recipe.name);
  const room = utils.makeMQTTConform(recipe.roomName);

  return `${topicRoot}${group}recipes/${room}/${name}`;
}

function publishValue(recipe) {
  const value = true;
  const transformedValue = utils.transformValue(value);
  const topic = getTopicForActiveRecipe(recipe, transformedValue);

  mqtt.forwardValue(topic, transformedValue);
}