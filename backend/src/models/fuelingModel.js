const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Fueling = sequelize.define('Fueling', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'veiculos',
        key: 'id'
      }
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quilometragem_atual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    litros: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    preco_litro: {
      type: DataTypes.DECIMAL(10, 3),
    },
    tipo_combustivel: {
      type: DataTypes.STRING(50),
    },
    posto_combustivel: {
      type: DataTypes.STRING(100),
    },
    observacoes: {
      type: DataTypes.TEXT,
    },
    tanque_cheio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'abastecimentos',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
    hooks: {
      beforeCreate: async (fueling) => {
        // Se preco_litro não foi fornecido, calcula baseado em valor_total e litros
        if (!fueling.preco_litro && fueling.valor_total && fueling.litros) {
          fueling.preco_litro = fueling.valor_total / fueling.litros;
        }
      },
      beforeUpdate: async (fueling) => {
        // Atualiza preco_litro se valor_total ou litros foram alterados
        if (fueling.changed('valor_total') || fueling.changed('litros')) {
          fueling.preco_litro = fueling.valor_total / fueling.litros;
        }
      }
    }
  });

  Fueling.associate = (models) => {
    Fueling.belongsTo(models.Vehicle, {
      foreignKey: 'id_veiculo',
      as: 'vehicle'
    });
  };

  return Fueling;
}; 