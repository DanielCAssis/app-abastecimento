const { Fueling, Vehicle } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verifica se o veículo pertence ao usuário
    const vehicle = await Vehicle.findOne({
      where: {
        id: req.body.id_veiculo,
        id_usuario: req.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    const fueling = await Fueling.create(req.body);

    // Atualiza a quilometragem do veículo para o valor do abastecimento
    await Vehicle.update(
      { quilometragem_inicial: req.body.quilometragem_atual },
      { where: { id: req.body.id_veiculo } }
    );

    return res.status(201).json(fueling);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar abastecimento' });
  }
};

exports.list = async (req, res) => {
  try {
    const { id_veiculo, data_inicio, data_fim } = req.query;
    const where = {};

    // Filtro por veículo
    if (id_veiculo) {
      const vehicle = await Vehicle.findOne({
        where: {
          id: id_veiculo,
          id_usuario: req.userId
        }
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      where.id_veiculo = id_veiculo;
    } else {
      // Se não especificar veículo, lista todos os veículos do usuário
      const vehicles = await Vehicle.findAll({
        where: { id_usuario: req.userId },
        attributes: ['id']
      });
      where.id_veiculo = {
        [Op.in]: vehicles.map(v => v.id)
      };
    }

    // Filtro por período
    if (data_inicio || data_fim) {
      where.data_hora = {};
      if (data_inicio) {
        where.data_hora[Op.gte] = new Date(data_inicio);
      }
      if (data_fim) {
        where.data_hora[Op.lte] = new Date(data_fim);
      }
    }

    const fuelings = await Fueling.findAll({
      where,
      include: [{
        model: Vehicle,
        as: 'vehicle',
        attributes: ['nome_veiculo', 'placa']
      }],
      order: [['data_hora', 'DESC']]
    });

    return res.json(fuelings);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar abastecimentos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const fueling = await Fueling.findOne({
      where: { id: req.params.id },
      include: [{
        model: Vehicle,
        as: 'vehicle',
        where: { id_usuario: req.userId },
        attributes: ['nome_veiculo', 'placa']
      }]
    });

    if (!fueling) {
      return res.status(404).json({ error: 'Abastecimento não encontrado' });
    }

    return res.json(fueling);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar abastecimento' });
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const fueling = await Fueling.findOne({
      where: { id: req.params.id },
      include: [{
        model: Vehicle,
        as: 'vehicle',
        where: { id_usuario: req.userId }
      }]
    });

    if (!fueling) {
      return res.status(404).json({ error: 'Abastecimento não encontrado' });
    }

    await fueling.update(req.body);

    return res.json(fueling);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar abastecimento' });
  }
};

exports.delete = async (req, res) => {
  try {
    const fueling = await Fueling.findOne({
      where: { id: req.params.id },
      include: [{
        model: Vehicle,
        as: 'vehicle',
        where: { id_usuario: req.userId }
      }]
    });

    if (!fueling) {
      return res.status(404).json({ error: 'Abastecimento não encontrado' });
    }

    await fueling.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir abastecimento' });
  }
};

// Relatórios
exports.getConsumptionReport = async (req, res) => {
  try {
    const { id_veiculo, data_inicio, data_fim } = req.query;

    // Verifica se o veículo pertence ao usuário
    const vehicle = await Vehicle.findOne({
      where: {
        id: id_veiculo,
        id_usuario: req.userId
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    const where = {
      id_veiculo,
      tanque_cheio: true
    };

    if (data_inicio || data_fim) {
      where.data_hora = {};
      if (data_inicio) {
        where.data_hora[Op.gte] = new Date(data_inicio);
      }
      if (data_fim) {
        where.data_hora[Op.lte] = new Date(data_fim);
      }
    }

    const fuelings = await Fueling.findAll({
      where,
      order: [['data_hora', 'ASC']]
    });

    // Calcula o consumo médio
    let totalKm = 0;
    let totalLitros = 0;
    let consumoMedio = 0;

    if (fuelings.length >= 2) {
      for (let i = 1; i < fuelings.length; i++) {
        const kmRodados = fuelings[i].quilometragem_atual - fuelings[i - 1].quilometragem_atual;
        totalKm += kmRodados;
        totalLitros += fuelings[i].litros;
      }
      consumoMedio = totalKm / totalLitros;
    }

    return res.json({
      total_km: totalKm,
      total_litros: totalLitros,
      consumo_medio: consumoMedio.toFixed(2),
      abastecimentos: fuelings.length
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao gerar relatório de consumo' });
  }
}; 