'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('players', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(250)
      },
      nickname: {
        type: Sequelize.STRING(250)
      },
      email: {
        type: Sequelize.STRING(100)
      },
      password: {
        type: Sequelize.STRING(250)
      },
      status: {
        type: Sequelize.STRING(20)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Adicionando um índice único para a combinação de email e nickname
    await queryInterface.addIndex('players', ['email', 'nickname'], {
      unique: true,
      name: 'unique_email_nickname'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Desfazendo a criação da tabela
    await queryInterface.dropTable('players');
  }
};
