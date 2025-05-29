const { Vehicle } = require('../models');
const { validationResult } = require('express-validator');

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.create({
      ...req.body,
      id_usuario: req.userId
    });

    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar veículo' });
  }
};

exports.list = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { id_usuario: req.userId },
      order: [['data_criacao', 'DESC']]
    });

    return res.json(vehicles);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar veículos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        id_usuario: req.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    return res.json(vehicle);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar veículo' });
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        id_usuario: req.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    await vehicle.update(req.body);

    return res.json(vehicle);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
};

exports.delete = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.params.id,
        id_usuario: req.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    await vehicle.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir veículo' });
  }
}; 