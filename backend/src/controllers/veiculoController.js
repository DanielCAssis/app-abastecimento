const { Veiculo, Abastecimento } = require('../models');
const autonomiaService = require('../services/autonomiaService');

class VeiculoController {
  // ... outros métodos existentes ...

  // Verificar autonomia do veículo
  async verificarAutonomia(req, res) {
    try {
      const { id } = req.params;

      const veiculo = await Veiculo.findOne({
        where: {
          id,
          id_usuario: req.usuario.id
        }
      });

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      const autonomia = await autonomiaService.calcularAutonomia(id);
      if (!autonomia) {
        return res.status(400).json({ 
          error: 'Não há dados suficientes para calcular a autonomia',
          detalhes: 'É necessário ter pelo menos dois abastecimentos com tanque cheio e o tamanho do tanque cadastrado'
        });
      }

      return res.json(autonomia);
    } catch (error) {
      console.error('Erro ao verificar autonomia:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Verificar necessidade de lembrete
  async verificarLembrete(req, res) {
    try {
      const { id } = req.params;
      const { limitePercentual } = req.query;

      const veiculo = await Veiculo.findOne({
        where: {
          id,
          id_usuario: req.usuario.id
        }
      });

      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      const lembrete = await autonomiaService.verificarLembrete(
        id,
        limitePercentual ? parseInt(limitePercentual) : undefined
      );

      if (!lembrete) {
        return res.status(400).json({ 
          error: 'Não há dados suficientes para verificar o lembrete',
          detalhes: 'É necessário ter pelo menos dois abastecimentos com tanque cheio e o tamanho do tanque cadastrado'
        });
      }

      return res.json(lembrete);
    } catch (error) {
      console.error('Erro ao verificar lembrete:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Calcular previsão de próximo abastecimento
  async calcularPrevisaoAbastecimento(req, res) {
    try {
      const { id } = req.params;
      const veiculoId = id || req.query.veiculo_id;

      // Buscar o veículo
      const veiculo = await Veiculo.findByPk(veiculoId);
      if (!veiculo) {
        return res.status(404).json({ error: 'Veículo não encontrado' });
      }

      // Buscar os últimos 3 abastecimentos do veículo
      const abastecimentos = await Abastecimento.findAll({
        where: { id_veiculo: veiculoId },
        order: [['data', 'DESC']],
        limit: 3
      });

      if (abastecimentos.length < 2) {
        return res.json({
          tem_dados_suficientes: false,
          mensagem: 'Aguardando mais abastecimentos para calcular a previsão'
        });
      }

      // Calcular média de dias entre abastecimentos
      const diasEntreAbastecimentos = [];
      for (let i = 0; i < abastecimentos.length - 1; i++) {
        const dataAtual = new Date(abastecimentos[i].data);
        const dataAnterior = new Date(abastecimentos[i + 1].data);
        const diffDias = Math.round((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
        diasEntreAbastecimentos.push(diffDias);
      }

      const mediaDias = diasEntreAbastecimentos.reduce((a, b) => a + b, 0) / diasEntreAbastecimentos.length;

      // Calcular média de quilômetros por dia
      const kmPorDia = [];
      for (let i = 0; i < abastecimentos.length - 1; i++) {
        const kmAtual = abastecimentos[i].quilometragem;
        const kmAnterior = abastecimentos[i + 1].quilometragem;
        const dias = diasEntreAbastecimentos[i];
        if (dias > 0) {
          kmPorDia.push((kmAtual - kmAnterior) / dias);
        }
      }

      const mediaKmPorDia = kmPorDia.reduce((a, b) => a + b, 0) / kmPorDia.length;

      // Calcular data do próximo abastecimento
      const ultimoAbastecimento = new Date(abastecimentos[0].data);
      const proximaData = new Date(ultimoAbastecimento.getTime() + (mediaDias * 24 * 60 * 60 * 1000));

      // Calcular quilometragem estimada
      const quilometragemAtual = abastecimentos[0].quilometragem;
      const quilometragemEstimada = Math.round(quilometragemAtual + (mediaKmPorDia * mediaDias));

      res.json({
        tem_dados_suficientes: true,
        proxima_data: proximaData,
        quilometragem_estimada: quilometragemEstimada,
        media_dias: Math.round(mediaDias),
        media_km_dia: Math.round(mediaKmPorDia)
      });
    } catch (error) {
      console.error('Erro ao calcular previsão:', error);
      res.status(500).json({ error: 'Erro ao calcular previsão de abastecimento' });
    }
  }
}

module.exports = new VeiculoController(); 