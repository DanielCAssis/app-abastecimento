const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Veiculo, {
        foreignKey: 'id_usuario',
        as: 'veiculos'
      });

      Usuario.hasMany(models.Posto, {
        foreignKey: 'id_usuario',
        as: 'postos'
      });
    }
  }

  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
  });

  return Usuario;
}; 