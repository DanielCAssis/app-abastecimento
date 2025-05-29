'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Posto extends Model {
    static associate(models) {
      Posto.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });
      
      Posto.hasMany(models.PrecoPosto, {
        foreignKey: 'id_posto',
        as: 'precos'
      });

      Posto.hasMany(models.Abastecimento, {
        foreignKey: 'id_posto',
        as: 'abastecimentos'
      });
    }
  }

  Posto.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Posto',
    tableName: 'postos',
    timestamps: true,
    underscored: true
  });

  return Posto;
}; 