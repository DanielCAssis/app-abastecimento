const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
    hooks: {
      beforeCreate: async (user) => {
        if (user.senha_hash) {
          const salt = await bcrypt.genSalt(10);
          user.senha_hash = await bcrypt.hash(user.senha_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('senha_hash') && user.senha_hash) {
          const salt = await bcrypt.genSalt(10);
          user.senha_hash = await bcrypt.hash(user.senha_hash, salt);
        }
      }
    }
  });

  User.prototype.validPassword = async function (password) {
    return bcrypt.compare(password, this.senha_hash);
  };

  User.associate = (models) => {
    User.hasMany(models.Vehicle, {
      foreignKey: 'id_usuario',
      as: 'vehicles'
    });
  };

  return User;
}; 