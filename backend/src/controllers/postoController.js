const { Posto, PrecoPosto } = require('../models');
const { Op } = require('sequelize');

class PostoController {
  // Listar todos os postos do usuário
  async listar(req, res) {
    try {
      const postos = await Posto.findAll({
        where: { id_usuario: req.usuario.id },
        include: [{
          model: PrecoPosto,
          as: 'precos',
          limit: 1,
          order: [['data_registro', 'DESC']]
        }]
      });

      return res.json(postos);
    } catch (error) {
      console.error('Erro ao listar postos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar novo posto
  async criar(req, res) {
    try {
      const { nome, endereco, latitude, longitude } = req.body;

      const posto = await Posto.create({
        nome,
        endereco,
        latitude,
        longitude,
        id_usuario: req.usuario.id
      });

      return res.status(201).json(posto);
    } catch (error) {
      console.error('Erro ao criar posto:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar posto
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, endereco, latitude, longitude } = req.body;

      const posto = await Posto.findOne({
        where: {
          id,
          id_usuario: req.usuario.id
        }
      });

      if (!posto) {
        return res.status(404).json({ error: 'Posto não encontrado' });
      }

      await posto.update({
        nome,
        endereco,
        latitude,
        longitude
      });

      return res.json(posto);
    } catch (error) {
      console.error('Erro ao atualizar posto:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Deletar posto
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const posto = await Posto.findOne({
        where: {
          id,
          id_usuario: req.usuario.id
        }
      });

      if (!posto) {
        return res.status(404).json({ error: 'Posto não encontrado' });
      }

      await posto.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar posto:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Buscar último preço de um tipo de combustível em um posto
  async buscarUltimoPreco(req, res) {
    try {
      const { id_posto, tipo_combustivel } = req.query;

      const ultimoPreco = await PrecoPosto.findOne({
        where: {
          id_posto,
          tipo_combustivel
        },
        order: [['data_registro', 'DESC']]
      });

      return res.json(ultimoPreco);
    } catch (error) {
      console.error('Erro ao buscar último preço:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Registrar novo preço
  async registrarPreco(req, res) {
    try {
      const { id_posto, tipo_combustivel, preco_litro } = req.body;

      const posto = await Posto.findOne({
        where: {
          id: id_posto,
          id_usuario: req.usuario.id
        }
      });

      if (!posto) {
        return res.status(404).json({ error: 'Posto não encontrado' });
      }

      const preco = await PrecoPosto.create({
        id_posto,
        tipo_combustivel,
        preco_litro,
        data_registro: new Date()
      });

      return res.status(201).json(preco);
    } catch (error) {
      console.error('Erro ao registrar preço:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new PostoController(); 