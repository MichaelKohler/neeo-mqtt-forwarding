'use strict';

const config = require('./lib/config');
const sensorHandler = require('./lib/sensorHandler');
const recipeHandler = require('./lib/recipeHandler');

const [
  forwardSensorValues,
  forwardActiveRecipes
] = config.getActivation();

if (!forwardActiveRecipes && !forwardSensorValues) {
  throw new Error('NO_FORWARDING_ACTIVE');
  process.exit(1);
}

if (forwardSensorValues) {
  sensorHandler.startForwarding();
}

if (forwardActiveRecipes) {
  recipeHandler.startForwarding();
}