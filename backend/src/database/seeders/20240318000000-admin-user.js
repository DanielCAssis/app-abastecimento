'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash('m0g4m9ms', salt);

    await queryInterface.bulkInsert('usuarios', [{
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha_hash,
      is_admin: true,
      data_criacao: new Date(),
      data_atualizacao: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', {
      email: 'admin@admin.com'
    }, {});
  }
}; 