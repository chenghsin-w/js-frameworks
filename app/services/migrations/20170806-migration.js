module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.createTable('todo', {
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
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      })
    ];
  },
  down: function (queryInterface, Sequelize) {
  }
};
