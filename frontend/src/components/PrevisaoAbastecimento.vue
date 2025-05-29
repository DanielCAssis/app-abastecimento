<template>
  <div class="previsao-card">
    <div class="previsao-header">
      <i class="pi pi-calendar"></i>
      <h3>Previsão de Abastecimento</h3>
    </div>
    <div v-if="carregando" class="previsao-loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span>Calculando previsão...</span>
    </div>
    <div v-else-if="!temDadosSuficientes" class="previsao-mensagem">
      <i class="pi pi-info-circle"></i>
      <span>Aguardando abastecimentos para obter dados</span>
    </div>
    <div v-else class="previsao-conteudo">
      <div class="previsao-item">
        <span class="label">Próximo abastecimento em:</span>
        <span class="valor">{{ proximoAbastecimento }}</span>
      </div>
      <div class="previsao-item">
        <span class="label">Quilometragem estimada:</span>
        <span class="valor">{{ quilometragemEstimada }} km</span>
      </div>
      <div class="previsao-observacao">
        <i class="pi pi-info-circle"></i>
        <span>Esta é uma estimativa baseada no seu histórico de abastecimentos</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const carregando = ref(true)
const temDadosSuficientes = ref(false)
const proximoAbastecimento = ref('')
const quilometragemEstimada = ref(0)

const calcularPrevisao = async () => {
  try {
    carregando.value = true
    const response = await axios.get('/api/vehicles/autonomia')
    
    if (response.data && response.data.proxima_data) {
      temDadosSuficientes.value = true
      
      // Formatar a data do próximo abastecimento
      const data = new Date(response.data.proxima_data)
      proximoAbastecimento.value = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      quilometragemEstimada.value = Math.round(response.data.quilometragem_estimada)
    } else {
      temDadosSuficientes.value = false
    }
  } catch (error) {
    console.error('Erro ao calcular previsão:', error)
    temDadosSuficientes.value = false
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  calcularPrevisao()
})
</script>

<style scoped>
.previsao-card {
  background: #fff;
  border-radius: 1.2rem;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.previsao-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.previsao-header i {
  color: #7b5fff;
  font-size: 1.4rem;
}

.previsao-header h3 {
  color: #2d2357;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.previsao-loading,
.previsao-mensagem {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #666;
  font-size: 1rem;
  padding: 1rem 0;
}

.previsao-conteudo {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.previsao-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.previsao-item:last-child {
  border-bottom: none;
}

.previsao-item .label {
  color: #666;
  font-size: 0.95rem;
}

.previsao-item .valor {
  color: #2d2357;
  font-weight: 600;
  font-size: 1.1rem;
}

.previsao-observacao {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.8rem;
  background: #f8f9ff;
  border-radius: 0.8rem;
  color: #666;
  font-size: 0.9rem;
}

.previsao-observacao i {
  color: #7b5fff;
}
</style> 