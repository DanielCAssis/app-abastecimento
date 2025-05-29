const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    nome_veiculo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    marca: {
      type: DataTypes.STRING(50),
    },
    modelo: {
      type: DataTypes.STRING(50),
    },
    ano: {
      type: DataTypes.INTEGER,
    },
    placa: {
      type: DataTypes.STRING(10),
      unique: true,
    },
    cor: {
      type: DataTypes.STRING(30),
    },
    quilometragem_inicial: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'veiculos',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, {
      foreignKey: 'id_usuario',
      as: 'user'
    });
    Vehicle.hasMany(models.Fueling, {
      foreignKey: 'id_veiculo',
      as: 'fuelings'
    });
  };

  return Vehicle;
}; 