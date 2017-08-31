module.exports = function (sequelize, Sequelize) {
  const MODEL_NAME = 'todo';
  return sequelize.define(MODEL_NAME, {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    done: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: MODEL_NAME
  })
};
