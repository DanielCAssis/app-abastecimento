const { MediaConsumo, Vehicle, Abastecimento } = require('../models');
const { Op } = require('sequelize');

// Função para calcular a média de consumo de um veículo
const calcularMediaConsumo = async (idVeiculo) => {
  try {
    console.log('\n[DEBUG] Iniciando cálculo de média');
    console.log(`[DEBUG] ID do veículo: ${idVeiculo}`);
    
    // Verificar se o veículo existe
    const veiculo = await Vehicle.findByPk(idVeiculo);
    console.log(`[DEBUG] Veículo encontrado: ${veiculo ? 'SIM' : 'NÃO'}`);
    
    if (!veiculo) {
      console.log('[DEBUG] Veículo não encontrado');
      return null;
    }

    // Buscar os últimos 5 abastecimentos do veículo com tanque cheio
    console.log('[DEBUG] Buscando abastecimentos...');
    const abastecimentos = await Abastecimento.findAll({
      attributes: ['id', 'data_hora', 'quilometragem_atual', 'tipo_combustivel', 'preco_litro', 'litros', 'valor_total', 'tanque_cheio', 'id_veiculo'],
      where: {
        id_veiculo: idVeiculo,
        tanque_cheio: true
      },
      order: [['data_hora', 'ASC']],
      limit: 5
    });

    console.log(`[DEBUG] Abastecimentos encontrados: ${abastecimentos.length}`);
    
    if (abastecimentos.length < 2) {
      console.log('[DEBUG] Abastecimentos insuficientes');
      return null;
    }

    // Calcular o consumo entre cada par de abastecimentos
    const consumos = [];
    for (let i = 1; i < abastecimentos.length; i++) {
      const atual = abastecimentos[i];
      const anterior = abastecimentos[i - 1];
      
      const distancia = atual.quilometragem_atual - anterior.quilometragem_atual;
      const litros = parseFloat(atual.litros);
      
      console.log(`[DEBUG] Comparação ${i}:`);
      console.log(`[DEBUG] - Data atual: ${atual.data_hora}`);
      console.log(`[DEBUG] - Data anterior: ${anterior.data_hora}`);
      console.log(`[DEBUG] - Quilometragem atual: ${atual.quilometragem_atual}km`);
      console.log(`[DEBUG] - Quilometragem anterior: ${anterior.quilometragem_atual}km`);
      console.log(`[DEBUG] - Distância: ${distancia}km`);
      console.log(`[DEBUG] - Litros: ${litros}L`);
      
      if (distancia > 0 && litros > 0) {
        const consumo = distancia / litros;
        console.log(`[DEBUG] - Consumo: ${consumo.toFixed(2)}km/L`);
        
        if (consumo >= 5 && consumo <= 50) {
          consumos.push(consumo);
          console.log('[DEBUG] - Consumo válido');
        } else {
          console.log('[DEBUG] - Consumo fora do intervalo válido (5-50 km/L)');
        }
      } else {
        console.log('[DEBUG] - Distância ou litros inválidos');
      }
    }

    if (consumos.length === 0) {
      console.log('[DEBUG] Nenhum consumo válido');
      return null;
    }

    const mediaConsumo = consumos.reduce((a, b) => a + b, 0) / consumos.length;
    console.log(`[DEBUG] Média final: ${mediaConsumo.toFixed(2)}km/L`);

    // Atualizar ou criar o registro de média
    const [media, created] = await MediaConsumo.findOrCreate({
      where: { id_veiculo: idVeiculo },
      defaults: {
        media_consumo: mediaConsumo,
        data_calculo: new Date()
      }
    });

    if (!created) {
      media.media_consumo = mediaConsumo;
      media.data_calculo = new Date();
      await media.save();
    }

    console.log('[DEBUG] Média salva:', media.toJSON());
    return media;
  } catch (error) {
    console.error('[ERRO] Erro no cálculo:', error);
    throw error;
  }
};

const getMediaConsumo = async (req, res) => {
  try {
    console.log('\n[DEBUG] GET /api/medias-consumo');
    const { idVeiculo } = req.params;
    console.log(`[DEBUG] ID do veículo: ${idVeiculo}`);

    const veiculo = await Vehicle.findByPk(idVeiculo);
    if (!veiculo) {
      console.log('[DEBUG] Veículo não encontrado');
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    const mediaSalva = await calcularMediaConsumo(idVeiculo);
    console.log('[DEBUG] Resposta:', mediaSalva ? mediaSalva.toJSON() : null);

    res.json({
      media_consumo: mediaSalva ? mediaSalva.media_consumo : null,
      data_calculo: mediaSalva ? mediaSalva.data_calculo : null
    });
  } catch (error) {
    console.error('[ERRO] Erro na requisição:', error);
    res.status(500).json({ error: 'Erro ao buscar média de consumo' });
  }
};

const recalcularMediaConsumo = async (req, res) => {
  try {
    console.log('\n[DEBUG] POST /api/medias-consumo/recalcular');
    const { idVeiculo } = req.params;
    console.log(`[DEBUG] ID do veículo: ${idVeiculo}`);
    
    const mediaSalva = await calcularMediaConsumo(idVeiculo);
    console.log('[DEBUG] Resposta:', mediaSalva ? mediaSalva.toJSON() : null);
    
    res.json({
      media_consumo: mediaSalva ? mediaSalva.media_consumo : null,
      data_calculo: mediaSalva ? mediaSalva.data_calculo : null
    });
  } catch (error) {
    console.error('[ERRO] Erro na requisição:', error);
    res.status(500).json({ error: 'Erro ao recalcular média de consumo' });
  }
};

const getAllMediasConsumo = async (req, res) => {
  try {
    console.log('\n[DEBUG] GET /api/medias-consumo');
    
    // Buscar todos os veículos
    const veiculos = await Vehicle.findAll();
    console.log(`[DEBUG] Veículos encontrados: ${veiculos.length}`);
    
    // Calcular média para cada veículo
    const medias = [];
    for (const veiculo of veiculos) {
      const mediaSalva = await calcularMediaConsumo(veiculo.id);
      if (mediaSalva) {
        medias.push({
          id_veiculo: veiculo.id,
          nome_veiculo: veiculo.nome,
          media_consumo: mediaSalva.media_consumo,
          data_calculo: mediaSalva.data_calculo
        });
      }
    }
    
    console.log(`[DEBUG] Médias calculadas: ${medias.length}`);
    res.json(medias);
  } catch (error) {
    console.error('[ERRO] Erro na requisição:', error);
    res.status(500).json({ error: 'Erro ao buscar médias de consumo' });
  }
};

module.exports = {
  getMediaConsumo,
  recalcularMediaConsumo,
  getAllMediasConsumo
}; 