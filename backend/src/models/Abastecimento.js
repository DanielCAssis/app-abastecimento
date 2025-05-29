'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Abastecimento extends Model {
    static associate(models) {
      Abastecimento.belongsTo(models.Veiculo, {
        foreignKey: 'id_veiculo',
        as: 'veiculo'
      });
    }
  }

  Abastecimento.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    quilometragem_atual: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_combustivel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco_litro: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    litros: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tanque_cheio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'veiculos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Abastecimento',
    tableName: 'abastecimentos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Abastecimento;
}; 