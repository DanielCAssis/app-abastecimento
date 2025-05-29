'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medias_consumo', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_veiculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'veiculos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      media_consumo: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Média de consumo em km/l'
      },
      data_calculo: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Adicionar índices
    await queryInterface.addIndex('medias_consumo', ['id_veiculo']);
    await queryInterface.addIndex('medias_consumo', ['data_calculo']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('medias_consumo');
  }
}; 