const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const FILE_REGEX = /\.js$/;

class ModelService {
  constructor (config) {
    this._sequelize = new Sequelize(config);
    this._models = {};
  }

  init () {
    return new Promise((resolve, reject) => {
      let umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
          sequelize: this.sequelize
        },
        migrations: {
          params: [this.sequelize.getQueryInterface(), this.sequelize.constructor],
          path: path.resolve(__dirname, 'migrations'),
          pattern: FILE_REGEX
        }
      });

      umzug.up().then(() => {
        fs.readdirSync(path.join(__dirname, 'models')).filter((file) => {
          return FILE_REGEX.test(file);
        }).forEach((file) => {
          let model = this.sequelize.import(path.join(__dirname, 'models', file));
          this.models[model.name] = model;
        });

        Object.keys(this.models).forEach((modelName) => {
          // Call associate method if it exists for creating table relationships
          if ('associate' in this.models[modelName]) {
            this.models[modelName].associate(this.models);
          }
        });
        resolve();
      }).catch((error) => {
        reject(error);
      })
    })
  }

  get sequelize () {
    return this._sequelize;
  }

  get models () {
    return this._models;
  }
}

module.exports = ModelService;
