const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Veiculo extends Model {
    static associate(models) {
      Veiculo.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario'
      });

      Veiculo.hasMany(models.Abastecimento, {
        foreignKey: 'id_veiculo',
        as: 'abastecimentos'
      });
    }
  }

  Veiculo.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    quilometragem_atual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tamanho_tanque: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    tipo_combustivel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Veiculo',
    tableName: 'veiculos',
    timestamps: true,
    underscored: true
  });

  return Veiculo;
}; 