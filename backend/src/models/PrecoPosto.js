'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PrecoPosto extends Model {
    static associate(models) {
      PrecoPosto.belongsTo(models.Posto, {
        foreignKey: 'id_posto',
        as: 'posto'
      });
    }
  }

  PrecoPosto.init({
    id_posto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_combustivel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    preco_litro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    data_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PrecoPosto',
    tableName: 'precos_posto',
    timestamps: true,
    underscored: true
  });

  return PrecoPosto;
}; 