'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class MediaConsumo extends Model {
    static associate(models) {
      MediaConsumo.belongsTo(models.Vehicle, {
        foreignKey: 'id_veiculo',
        as: 'veiculo'
      });
    }
  }
  
  MediaConsumo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'veiculos',
        key: 'id'
      }
    },
    media_consumo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Média de consumo em km/l'
    },
    data_calculo: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'MediaConsumo',
    tableName: 'medias_consumo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  return MediaConsumo;
}; 