const ModelService = require('./modelService');
const dbConfig = require('../config/db.config');

let modelService;

class Factory {
  static getModelService () {
    if (!modelService) {
      modelService = new ModelService(dbConfig);
    }
    return modelService;
  }
}

module.exports = Factory;
