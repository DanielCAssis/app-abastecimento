<template>
  <div class="reports-header">
    <div class="reports-header-title-row">
      <span class="reports-header-title">Relatórios</span>
      <i class="pi pi-filter reports-header-filter"></i>
    </div>
    <div class="reports-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['reports-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="reports-vehicle-select" v-if="vehicles.length">
      <label for="vehicle" style="font-weight:600;margin-right:0.5rem;">Veículo:</label>
      <select v-model="selectedVehicleId" id="vehicle" class="reports-dropdown">
        <option v-for="v in vehicles" :key="v.id" :value="v.id">
          {{ v.nome_veiculo || v.nome }} - {{ v.placa }}
        </option>
      </select>
    </div>
  </div>

  <div class="reports-content">
    <div v-if="activeTab === 'geral'">
      <div class="reports-card">
        <div class="reports-card-title">Custo</div>
        <div class="reports-card-row">
          <div>
            <div class="reports-card-label">Total</div>
            <div class="reports-card-value">R$ {{ totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          </div>
          <div>
            <div class="reports-card-label">Por dia</div>
            <div class="reports-card-value">R$ {{ costPerDay.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          </div>
          <div>
            <div class="reports-card-label">Por km</div>
            <div class="reports-card-value">R$ {{ costPerKm > 0 ? costPerKm.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--' }}</div>
          </div>
        </div>
      </div>
      <div class="reports-card">
        <div class="reports-card-title">Distância</div>
        <div class="reports-card-row">
          <div>
            <div class="reports-card-label">Total</div>
            <div class="reports-card-value">{{ totalDistance > 0 ? totalDistance.toLocaleString('pt-BR') : '--' }} km</div>
          </div>
          <div>
            <div class="reports-card-label">Média diária</div>
            <div class="reports-card-value">{{ avgDistancePerDay > 0 ? avgDistancePerDay.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '--' }} km</div>
          </div>
        </div>
      </div>
      <div class="reports-card">
        <div class="reports-card-title">Registros</div>
        <div class="reports-card-row">
          <div>
            <div class="reports-card-label">Total</div>
            <div class="reports-card-value">{{ totalRecords }}</div>
          </div>
        </div>
      </div>
      <div class="reports-dropdown-row">
        <select v-model="selectedChart" class="reports-dropdown">
          <option value="custo">Custo</option>
          <option value="consumo">Consumo</option>
          <option value="distancia">Distância</option>
        </select>
      </div>
      <div class="reports-chart-placeholder">
        <Chart type="line" :data="chartData" :options="chartOptions" style="min-height:220px;" />
      </div>
    </div>

    <div v-else-if="activeTab === 'abastecimento'">
      <div class="reports-section-title abastecimento">Custo</div>
      <div class="reports-card">
        <div class="reports-card-row">
          <div>
            <div class="reports-card-label">Total</div>
            <div class="reports-card-value">R$ {{ fuelingTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          </div>
          <div>
            <div class="reports-card-label">Por dia</div>
            <div class="reports-card-value">R$ {{ costPerDay.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          </div>
          <div>
            <div class="reports-card-label">Por km</div>
            <div class="reports-card-value">R$ {{ costPerKm > 0 ? costPerKm.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--' }}</div>
          </div>
        </div>
      </div>
      <div class="reports-section-title abastecimento">Combustível</div>
      <div class="reports-card">
        <div class="reports-card-row">
          <div>
            <div class="reports-card-label">Volume total</div>
            <div class="reports-card-value">{{ fuelingTotalVolume > 0 ? fuelingTotalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--' }} L</div>
          </div>
          <div>
            <div class="reports-card-label">Média geral</div>
            <div class="reports-card-value">{{ fuelingAvg }} km/L</div>
          </div>
        </div>
        <div class="reports-card-row reports-card-row-multistats">
          <div>
            <div class="reports-card-label">ÚLTIMA</div>
            <div class="reports-card-value">{{ fuelingLast }} km/L</div>
          </div>
          <div class="reports-card-label maior">MAIOR</div>
          <div class="reports-card-value maior">{{ fuelingMax }} km/L</div>
          <div class="reports-card-label menor">MENOR</div>
          <div class="reports-card-value menor">{{ fuelingMin }} km/L</div>
        </div>
      </div>
      <div class="reports-section-title abastecimento">Gas. Comum</div>
      <div class="reports-card">
        <div class="reports-card-row">
          <div>
            <div class="reports-card-label">Custo total</div>
            <div class="reports-card-value">R$ {{ fuelingTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</div>
          </div>
          <div>
            <div class="reports-card-label">Volume total</div>
            <div class="reports-card-value">{{ fuelingTotalVolume > 0 ? fuelingTotalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--' }} L</div>
          </div>
        </div>
        <div class="reports-card-row reports-card-row-multistats">
          <div>
            <div class="reports-card-label">ÚLTIMA</div>
            <div class="reports-card-value">{{ fuelingLast }} km/L</div>
          </div>
          <div class="reports-card-label maior">MAIOR</div>
          <div class="reports-card-value maior">{{ fuelingMax }} km/L</div>
          <div class="reports-card-label menor">MENOR</div>
          <div class="reports-card-value menor">{{ fuelingMin }} km/L</div>
        </div>
        <div class="reports-card-row reports-card-row-multistats">
          <div>
            <div class="reports-card-label">Custo / Km</div>
            <div class="reports-card-value">R$ {{ fuelingCostPerKm }}</div>
          </div>
          <div class="reports-card-label menor">MENOR</div>
          <div class="reports-card-value menor">R$ {{ fuelingCostPerKm }}</div>
          <div class="reports-card-label maior">MAIOR</div>
          <div class="reports-card-value maior">R$ {{ fuelingCostPerKm }}</div>
        </div>
      </div>
    </div>
    <!-- Outras abas podem ser implementadas futuramente -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import Chart from 'primevue/chart'

const tabs = [
  { key: 'geral', label: 'GERAL' },
  { key: 'abastecimento', label: 'ABASTECIMENTO' },
  { key: 'despesa', label: 'DESPESA' },
  { key: 'receita', label: 'RECEITA' },
]
const activeTab = ref('geral')
const selectedChart = ref('custo')

// Dados
const fuelings = ref([])
const vehicles = ref([])
const selectedVehicleId = ref(null)
const filteredFuelings = computed(() =>
  fuelings.value.filter(f => f.id_veiculo === selectedVehicleId.value)
)
// const expenses = ref([]) // Para futuro
// const incomes = ref([]) // Para futuro

// Métricas Gerais
const totalRecords = ref(0)
const totalCost = ref(0)
const costPerDay = ref(0)
const costPerKm = ref(0)
const totalDistance = ref(0)
const avgDistancePerDay = ref(0)
const firstDate = ref(null)
const lastDate = ref(null)
const days = ref(1)

// Métricas Abastecimento
const fuelingTotalCost = ref(0)
const fuelingTotalVolume = ref(0)
const fuelingAvg = ref('--')
const fuelingLast = ref('--')
const fuelingMax = ref('--')
const fuelingMin = ref('--')
const fuelingCostPerKm = ref('--')

// Gráfico dinâmico
const chartData = computed(() => {
  if (!filteredFuelings.value.length) return { labels: [], datasets: [] }
  // Ordenar por data
  const sorted = [...filteredFuelings.value].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora))
  if (selectedChart.value === 'custo') {
    return {
      labels: sorted.map(f => new Date(f.data_hora).toLocaleDateString('pt-BR')),
      datasets: [
        {
          label: 'Custo (R$)',
          data: sorted.map(f => parseFloat(f.valor_total) || 0),
          fill: false,
          borderColor: '#00bcd4',
          backgroundColor: '#00bcd4',
          tension: 0.3
        }
      ]
    }
  } else if (selectedChart.value === 'consumo') {
    // Consumo médio por abastecimento completo
    const completos = sorted.filter(f => f.tanque_cheio && parseFloat(f.litros) > 0 && f.quilometragem_atual > 0)
    let labels = []
    let data = []
    for (let i = 1; i < completos.length; i++) {
      const km = completos[i].quilometragem_atual - completos[i - 1].quilometragem_atual
      const litros = parseFloat(completos[i].litros)
      if (km > 0 && litros > 0) {
        labels.push(new Date(completos[i].data_hora).toLocaleDateString('pt-BR'))
        data.push((km / litros))
      }
    }
    return {
      labels,
      datasets: [
        {
          label: 'Consumo (km/L)',
          data,
          fill: false,
          borderColor: '#4caf50',
          backgroundColor: '#4caf50',
          tension: 0.3
        }
      ]
    }
  } else if (selectedChart.value === 'distancia') {
    // Distância percorrida entre abastecimentos completos
    const completos = sorted.filter(f => f.tanque_cheio && parseFloat(f.litros) > 0 && f.quilometragem_atual > 0)
    let labels = []
    let data = []
    for (let i = 1; i < completos.length; i++) {
      const km = completos[i].quilometragem_atual - completos[i - 1].quilometragem_atual
      if (km > 0) {
        labels.push(new Date(completos[i].data_hora).toLocaleDateString('pt-BR'))
        data.push(km)
      }
    }
    return {
      labels,
      datasets: [
        {
          label: 'Distância (km)',
          data,
          fill: false,
          borderColor: '#ff9800',
          backgroundColor: '#ff9800',
          tension: 0.3
        }
      ]
    }
  }
  return { labels: [], datasets: [] }
})

const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: '#2d2357',
        font: { size: 14, weight: 'bold' }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#2d2357' },
      grid: { color: '#eee' }
    },
    y: {
      ticks: { color: '#2d2357' },
      grid: { color: '#eee' }
    }
  }
}

onMounted(async () => {
  try {
    // Buscar abastecimentos e veículos
    const [resFuelings, resVehicles] = await Promise.all([
      axios.get('/api/fuelings'),
      axios.get('/api/vehicles')
    ])
    fuelings.value = Array.isArray(resFuelings.data) ? resFuelings.data : []
    vehicles.value = Array.isArray(resVehicles.data) ? resVehicles.data : []

    // Seleciona o primeiro veículo por padrão
    if (vehicles.value.length) {
      selectedVehicleId.value = vehicles.value[0].id
    }
  } catch (err) {
    // Em caso de erro, mantém valores padrão
  }
})

watch([filteredFuelings, selectedVehicleId], () => {
    // GERAL
  totalRecords.value = filteredFuelings.value.length
    // Datas
  const datas = filteredFuelings.value.map(f => new Date(f.data_hora)).sort((a, b) => a - b)
    firstDate.value = datas[0]
    lastDate.value = datas[datas.length - 1]
    days.value = datas.length > 1 ? Math.max(1, Math.ceil((lastDate.value - firstDate.value) / (1000 * 60 * 60 * 24))) : 1
    // Custo total
  totalCost.value = filteredFuelings.value.reduce((sum, f) => sum + (parseFloat(f.valor_total) || 0), 0)
    // Distância total
  const kms = filteredFuelings.value.map(f => f.quilometragem_atual).filter(Boolean).sort((a, b) => a - b)
    totalDistance.value = kms.length > 1 ? kms[kms.length - 1] - kms[0] : 0
    // Custo por dia
    costPerDay.value = days.value > 0 ? totalCost.value / days.value : 0
    // Custo por km
    costPerKm.value = totalDistance.value > 0 ? totalCost.value / totalDistance.value : 0
    // Média diária de distância
    avgDistancePerDay.value = days.value > 0 ? totalDistance.value / days.value : 0

    // ABASTECIMENTO
    fuelingTotalCost.value = totalCost.value
  fuelingTotalVolume.value = filteredFuelings.value.reduce((sum, f) => sum + (parseFloat(f.litros) || 0), 0)
    // Consumo médio (km/l) - só abastecimentos completos
  const completos = filteredFuelings.value
      .filter(f => f.tanque_cheio && parseFloat(f.litros) > 0 && f.quilometragem_atual > 0)
      .sort((a, b) => a.quilometragem_atual - b.quilometragem_atual)
    let totalKm = 0
    let totalLitros = 0
    let medias = []
    for (let i = 1; i < completos.length; i++) {
      const km = completos[i].quilometragem_atual - completos[i - 1].quilometragem_atual
      const litros = parseFloat(completos[i].litros)
      if (km > 0 && litros > 0) {
        totalKm += km
        totalLitros += litros
        medias.push(km / litros)
      }
    }
    fuelingAvg.value = (totalKm > 0 && totalLitros > 0) ? (totalKm / totalLitros).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--'
    fuelingLast.value = medias.length ? medias[medias.length - 1].toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--'
    fuelingMax.value = medias.length ? Math.max(...medias).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--'
    fuelingMin.value = medias.length ? Math.min(...medias).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--'
    fuelingCostPerKm.value = totalDistance.value > 0 ? (fuelingTotalCost.value / totalDistance.value).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) : '--'
}, { immediate: true })
</script>

<style scoped>
.reports-header {
  background: #00bcd4;
  padding: 1.2rem 1.1rem 0.7rem 1.1rem;
  border-bottom-left-radius: 1.2rem;
  border-bottom-right-radius: 1.2rem;
  color: #fff;
  position: relative;
}
.reports-header-time {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.reports-header-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.7rem;
}
.reports-header-title {
  font-size: 1.5rem;
  font-weight: 800;
}
.reports-header-filter {
  font-size: 1.3rem;
  cursor: pointer;
}
.reports-tabs {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.2rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}
.reports-tabs::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
.reports-tab {
  min-width: 110px;
  text-align: center;
  flex-shrink: 0;
  font-size: 1.08rem;
  font-weight: 700;
  padding: 0.5rem 0.7rem 0.3rem 0.7rem;
  border-bottom: 2.5px solid transparent;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.reports-tab.active {
  border-bottom: 2.5px solid #ff9800;
  color: #ff9800;
  background: #fff2e0;
  border-radius: 0.7rem 0.7rem 0 0;
}
.reports-content {
  padding: 1.2rem 0.7rem 2.2rem 0.7rem;
  background: #f5f6fa;
  min-height: 100vh;
}
.reports-card {
  background: #fff;
  border-radius: 1.1rem;
  box-shadow: 0 2px 12px #0001;
  margin-bottom: 1.1rem;
  padding: 1.2rem 1.1rem 1.1rem 1.1rem;
}
.reports-card-title {
  font-size: 1.13rem;
  font-weight: 700;
  color: #ff9800;
  margin-bottom: 0.7rem;
}
.reports-card-row {
  display: flex;
  gap: 2.2rem;
  margin-bottom: 0.5rem;
}
.reports-card-label {
  font-size: 0.98rem;
  color: #888;
  font-weight: 600;
  margin-bottom: 0.1rem;
}
.reports-card-value {
  font-size: 1.18rem;
  font-weight: 800;
  color: #2d2357;
}
.reports-section-title {
  font-size: 1.13rem;
  font-weight: 700;
  margin: 1.2rem 0 0.5rem 0;
  color: #ff9800;
}
.reports-section-title.abastecimento {
  color: #ff9800;
}
.reports-card-row-multistats {
  display: flex;
  gap: 1.2rem;
  align-items: flex-end;
  margin-top: 0.5rem;
}
.reports-card-label.maior {
  color: #4caf50;
}
.reports-card-value.maior {
  color: #4caf50;
}
.reports-card-label.menor {
  color: #e74c3c;
}
.reports-card-value.menor {
  color: #e74c3c;
}
.reports-dropdown-row {
  margin: 1.2rem 0 0.7rem 0;
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.reports-dropdown {
  font-size: 1.08rem;
  border-radius: 0.7rem;
  padding: 0.4rem 1.1rem;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  color: #2d2357;
}
.reports-chart-placeholder {
  background: #fff;
  border-radius: 1.1rem;
  box-shadow: 0 2px 12px #0001;
  padding: 2.2rem 1.1rem;
  text-align: center;
  color: #888;
  font-size: 1.13rem;
  margin-bottom: 1.1rem;
}
.reports-vehicle-select {
  margin-top: 0.7rem;
  margin-left: 1.1rem;
  display: flex;
  align-items: center;
}
.reports-vehicle-select label {
  font-weight: 600;
  margin-right: 0.5rem;
}
.reports-vehicle-select select {
  font-size: 1.08rem;
  border-radius: 0.7rem;
  padding: 0.4rem 1.1rem;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  color: #2d2357;
}
</style> 