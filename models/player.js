// Model - player

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      // Associações de modelo, se houverem
    }
  };
  Player.init({
    name: DataTypes.STRING(250),
    nickname: DataTypes.STRING(250),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(250),
    status: DataTypes.STRING(20),
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'Player',
    timestamps: false // desabilita a criação das colunas created_at e updated_at
  });
  return Player;
};
