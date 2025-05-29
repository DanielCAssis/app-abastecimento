const { Abastecimento, Veiculo } = require('../models');
const { Op } = require('sequelize');

class AutonomiaService {
  // Calcula o consumo médio do veículo
  async calcularConsumoMedio(idVeiculo) {
    const abastecimentos = await Abastecimento.findAll({
      where: {
        id_veiculo: idVeiculo,
        tanque_cheio: true
      },
      order: [['data_hora', 'DESC']],
      limit: 5 // Considera os últimos 5 abastecimentos com tanque cheio
    });

    if (abastecimentos.length < 2) {
      return null; // Não há dados suficientes
    }

    let totalConsumo = 0;
    let totalKm = 0;

    for (let i = 0; i < abastecimentos.length - 1; i++) {
      const atual = abastecimentos[i];
      const anterior = abastecimentos[i + 1];

      const kmRodados = atual.quilometragem_atual - anterior.quilometragem_atual;
      const litrosConsumidos = atual.litros;

      if (kmRodados > 0 && litrosConsumidos > 0) {
        const consumo = kmRodados / litrosConsumidos;
        totalConsumo += consumo;
        totalKm += kmRodados;
      }
    }

    return totalKm > 0 ? totalConsumo / (abastecimentos.length - 1) : null;
  }

  // Calcula a autonomia estimada do veículo
  async calcularAutonomia(idVeiculo) {
    const veiculo = await Veiculo.findByPk(idVeiculo);
    if (!veiculo || !veiculo.tamanho_tanque) {
      return null;
    }

    const consumoMedio = await this.calcularConsumoMedio(idVeiculo);
    if (!consumoMedio) {
      return null;
    }

    const ultimoAbastecimento = await Abastecimento.findOne({
      where: {
        id_veiculo: idVeiculo,
        tanque_cheio: true
      },
      order: [['data_hora', 'DESC']]
    });

    if (!ultimoAbastecimento) {
      return null;
    }

    // Calcula a autonomia total
    const autonomiaTotal = veiculo.tamanho_tanque * consumoMedio;

    // Calcula a autonomia restante
    const kmRodados = veiculo.quilometragem_atual - ultimoAbastecimento.quilometragem_atual;
    const autonomiaRestante = autonomiaTotal - kmRodados;

    // Calcula o percentual de combustível restante
    const percentualRestante = (autonomiaRestante / autonomiaTotal) * 100;

    return {
      autonomiaTotal,
      autonomiaRestante,
      percentualRestante,
      consumoMedio,
      ultimoAbastecimento: ultimoAbastecimento.data_hora
    };
  }

  // Verifica se é necessário enviar um lembrete
  async verificarLembrete(idVeiculo, limitePercentual = 20) {
    const autonomia = await this.calcularAutonomia(idVeiculo);
    
    if (!autonomia) {
      return null;
    }

    if (autonomia.percentualRestante <= limitePercentual) {
      return {
        necessitaLembrete: true,
        mensagem: `Seu veículo está com ${autonomia.percentualRestante.toFixed(1)}% de combustível restante. Considere abastecer em breve.`,
        autonomiaRestante: autonomia.autonomiaRestante,
        percentualRestante: autonomia.percentualRestante
      };
    }

    return {
      necessitaLembrete: false,
      autonomiaRestante: autonomia.autonomiaRestante,
      percentualRestante: autonomia.percentualRestante
    };
  }
}

module.exports = new AutonomiaService(); 