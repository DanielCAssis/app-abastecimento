<template>
  <div class="home-bg-new">
    <div class="home-card-new">
      <div class="home-logo-new">
        <img src="@/assets/logo1.png" alt="Logo App Abastecimento" class="logo-img" />
      </div>
      <h2 class="home-title-new">Bem-vindo, {{ userName }}!</h2>
      <div class="metrics-grid-new">
        <div class="metric-card-new">
          <div class="metric-icon-new metric-icon-vehicle">
            <i class="pi pi-car"></i>
          </div>
          <div class="metric-label">Veículos</div>
          <div class="metric-value">{{ totalVehicles }}</div>
          <Button label="Ver veículos" class="metric-btn-new app-btn-main" @click="router.push('/vehicles')" />
        </div>
        <div class="metric-card-new">
          <div class="metric-icon-new metric-icon-fueling">
            <i class="pi pi-chart-line"></i>
          </div>
          <div class="metric-label">Abastecimentos</div>
          <div class="metric-value">{{ totalFuelings }}</div>
          <Button label="Ver abastecimentos" class="metric-btn-new app-btn-main" @click="router.push('/fuelings')" />
        </div>
        <div class="metric-card-new">
          <div class="metric-icon-new metric-icon-expense">
            <i class="pi pi-dollar"></i>
          </div>
          <div class="metric-label">Gastos</div>
          <div class="metric-value">R$ {{ totalExpenses }}</div>
          <Button label="Ver relatórios" class="metric-btn-new app-btn-main" @click="router.push('/reports')" />
        </div>
      </div>
      <!-- Previsão de Abastecimento -->
      <PrevisaoAbastecimento class="previsao-section" />
      <!-- Cards de consumo de cada veículo -->
      <div class="consumption-cards-list">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="metric-card-new consumption-card">
          <div class="metric-icon-new metric-icon-consumption">
            <i class="pi pi-chart-bar"></i>
          </div>
          <div class="metric-label">Consumo Médio</div>
          <div class="vehicle-name">{{ vehicle.nome }}</div>
          <div class="vehicle-plate">{{ vehicle.placa }}</div>
          <div class="consumption-value">
            {{ getConsumption(vehicle.id) }} km/l
            <i class="pi pi-info-circle info-icon" @click="showConsumptionInfo = true"></i>
          </div>
          <Button label="Ver relatórios" class="metric-btn-new app-btn-main" @click="router.push('/reports')" />
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="showConsumptionInfo" modal header="Como é calculada a média de consumo?" :style="{ width: '90vw', maxWidth: '500px' }">
    <div class="consumption-info">
      <p>Para garantir um cálculo preciso da média de consumo do seu veículo, o sistema utiliza apenas os intervalos entre dois abastecimentos em que o tanque foi cheio.</p>
      
      <h4>Exemplo prático:</h4>
      <div class="example-box">
        <p><strong>Primeiro abastecimento (tanque cheio):</strong></p>
        <ul>
          <li>Hodômetro: 255.000 km</li>
          <li>Litros abastecidos: 8,08 L</li>
        </ul>

        <p><strong>Segundo abastecimento (tanque cheio):</strong></p>
        <ul>
          <li>Hodômetro: 255.040 km</li>
          <li>Litros abastecidos: 6,46 L</li>
        </ul>

        <p><strong>Cálculo:</strong></p>
        <ul>
          <li>Distância percorrida: 40 km (255.040 - 255.000)</li>
          <li>Combustível consumido: 6,46 L</li>
          <li>Média de consumo: 6,19 km/L (40 ÷ 6,46)</li>
        </ul>
      </div>

      <div class="tips-box">
        <h4>Dicas importantes:</h4>
        <ul>
          <li>Sempre registre o hodômetro ao abastecer</li>
          <li>Realize abastecimentos com tanque cheio sempre que possível</li>
          <li>Se o último abastecimento não foi com o tanque cheio, a média não poderá ser calculada com precisão</li>
        </ul>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import PrevisaoAbastecimento from '../components/PrevisaoAbastecimento.vue'

const router = useRouter()
const authStore = useAuthStore()
const userName = computed(() => authStore.user?.nome || 'Usuário')
const showConsumptionInfo = ref(false)
const toast = useToast()

const totalVehicles = ref(0)
const totalFuelings = ref(0)
const totalExpenses = ref('0,00')
const vehicles = ref([])
const vehicleConsumptions = ref({})

const getConsumption = (vehicleId) => {
  const consumption = vehicleConsumptions.value[vehicleId]
  return consumption ? consumption.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) : '--'
}

onMounted(async () => {
  try {
    // Buscar veículos
    const resVehicles = await axios.get('/api/vehicles')
    vehicles.value = Array.isArray(resVehicles.data) ? resVehicles.data : []
    totalVehicles.value = vehicles.value.length

    // Buscar abastecimentos
    const resFuelings = await axios.get('/api/fuelings')
    const fuelings = Array.isArray(resFuelings.data) ? resFuelings.data : []
    totalFuelings.value = fuelings.length
    
    // Total gasto
    const total = fuelings.reduce((sum, f) => sum + (parseFloat(f.valor_total) || 0), 0)
    totalExpenses.value = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    // Buscar média de consumo para todos os veículos
    try {
      const mediaResponse = await axios.get('/api/medias-consumo', {
        headers: { 'Cache-Control': 'no-cache' }
      })
      if (Array.isArray(mediaResponse.data)) {
        mediaResponse.data.forEach(media => {
          vehicleConsumptions.value[media.id_veiculo] = media.media_consumo
        })
      }
    } catch (error) {
      console.error('Erro ao buscar médias de consumo:', error)
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    totalVehicles.value = 0
    totalFuelings.value = 0
    totalExpenses.value = '0,00'
    vehicles.value = []
    vehicleConsumptions.value = {}
  }
})
</script>

<style scoped>
.home-bg-new {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}
@media (max-width: 900px) {
  .home-bg-new {
    align-items: flex-start;
    justify-content: flex-start;
    background: #fff !important;
    min-width: 100vw;
    width: 100vw;
    padding: 0;
  }
  .home-card-new {
    max-width: 100vw !important;
    width: 100vw !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem !important;
  }
}
.home-card-new {
  background: #fff;
  border-radius: 2.5rem;
  box-shadow: 0 8px 32px #0001;
  padding: 2.5rem 2.2rem 2.2rem 2.2rem;
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 90px; /* Espaço para o BottomNav */
}
.home-logo-new {
  background: none;
  border-radius: 0;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: unset;
  margin-bottom: 1.5rem;
  box-shadow: none;
}
.home-title-new {
  font-size: 2rem;
  font-weight: 800;
  color: #2d2357;
  margin-bottom: 2.2rem;
  margin-top: 0.2rem;
  text-align: center;
  letter-spacing: 0.5px;
}
.metrics-grid-new {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.metric-card-new {
  background: #f5f6fa;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px #7b5fff11;
  padding: 1.5rem 1.1rem 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}
.metric-icon-new {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 8px #7b5fff22;
}
.metric-icon-vehicle {
  background: linear-gradient(135deg, #7b5fff 60%, #3c8ce7 100%);
  color: #fff;
}
.metric-icon-fueling {
  background: linear-gradient(135deg, #3c8ce7 60%, #7b5fff 100%);
  color: #fff;
}
.metric-icon-expense {
  background: linear-gradient(135deg, #f7c948 60%, #7b5fff 100%);
  color: #2d2357;
}
.metric-icon-consumption {
  background: linear-gradient(135deg, #2d2357 60%, #7b5fff 100%);
  color: #fff;
}
.metric-label {
  font-size: 1.08rem;
  color: #2d2357;
  font-weight: 600;
  margin-bottom: 0.2rem;
}
.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3c8ce7;
  margin-bottom: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.metric-btn-new {
  width: 100%;
  background: linear-gradient(90deg, #7b5fff 60%, #3c8ce7 100%);
  border: none;
  font-weight: 600;
  font-size: 0.98rem;
  border-radius: 1.5rem;
  height: 32px;
  color: #fff;
  box-shadow: 0 2px 8px #7b5fff22;
  margin-top: 0.2rem;
  padding: 0 1.2rem;
  min-width: 0;
  transition: background 0.2s, box-shadow 0.2s;
}
.metric-btn-new:hover {
  background: linear-gradient(90deg, #5f4bb6 60%, #2d2357 100%);
  box-shadow: 0 4px 16px #7b5fff33;
}
.consumption-info {
  padding: 0.5rem;
}

.consumption-info h4 {
  color: #2d2357;
  margin: 1.5rem 0 0.8rem 0;
  font-size: 1.1rem;
}

.example-box {
  background: #f5f6fa;
  border-radius: 1rem;
  padding: 1.2rem;
  margin: 1rem 0;
}

.example-box ul {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}

.example-box li {
  margin: 0.3rem 0;
  color: #2d2357;
}

.tips-box {
  background: #fff8e6;
  border-radius: 1rem;
  padding: 1.2rem;
  margin: 1rem 0;
}

.tips-box ul {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}

.tips-box li {
  margin: 0.3rem 0;
  color: #2d2357;
}

.info-icon {
  font-size: 1.1rem;
  color: #7b5fff;
  cursor: pointer;
  transition: color 0.2s;
}

.info-icon:hover {
  color: #5f4bb6;
}

.p-dialog-content {
  padding: 1.5rem 2.5rem 1.5rem 2.5rem !important;
}
.p-dialog-header {
  padding: 1.2rem 1.2rem 1.2rem 1.2rem !important;
}
.p-dialog-title {
  padding-left: 1.2rem;
  font-size: 1.18rem;
  font-weight: 50;
  color: #2d2357;
}
.p-dialog-header-icon {
  top: 1.1rem !important;
  right: 1.1rem !important;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.p-dialog-header-close-icon {
  font-size: 1.3rem;
}
.p-dialog {
  border-radius: 1.5rem !important;
}
</style>

<style>
.p-dialog .p-dialog-header {
  padding: 1.2rem 1.2rem 1.2rem 1.2rem !important;
}
.p-dialog .p-dialog-title {
  padding-left: 1.2rem;
  font-size: 1.18rem;
  font-weight: 700;
  color: #2d2357;
}
.p-dialog .p-dialog-header-icon {
  top: 1.1rem !important;
  right: 1.1rem !important;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.p-dialog .p-dialog-header-close-icon {
  font-size: 1.3rem;
}
.p-dialog {
  border-radius: 1.5rem !important;
}
.p-dialog .p-dialog-content {
  padding: 1.5rem 2.5rem 1.5rem 2.5rem !important;
}
</style>

<style scoped>
.consumption-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.consumption-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.8rem;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.vehicle-name {
  font-weight: 600;
  color: #2d2357;
  font-size: 1rem;
}

.vehicle-plate {
  font-size: 0.85rem;
  color: #666;
}

.consumption-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #7b5fff;
  font-size: 1.1rem;
}

.info-icon {
  font-size: 0.9rem;
  color: #7b5fff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.info-icon:hover {
  opacity: 1;
}

/* Ajuste para o botão de navegação */
:deep(.p-button) {
  position: relative;
  z-index: 1;
}

/* Ajuste para o card de métricas */
.metric-card-new {
  position: relative;
  z-index: 0;
}

/* Ajuste para o grid de métricas */
.metrics-grid-new {
  position: relative;
  z-index: 0;
}

.consumption-cards-list {
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.consumption-card {
  margin-bottom: 0;
  min-width: 0;
  background: #f5f6fa;
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px #7b5fff11;
  padding: 1.5rem 1.1rem 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.vehicle-name {
  font-weight: 700;
  color: #2d2357;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}
.vehicle-plate {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 0.5rem;
}
.consumption-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #7b5fff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.info-icon {
  font-size: 0.9rem;
  color: #7b5fff;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.info-icon:hover {
  opacity: 1;
}
@media (max-width: 900px) {
  .home-card-new {
    padding-bottom: 90px !important;
  }
}
.logo-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 0;
  background: none;
  display: block;
}
.previsao-section {
  width: 100%;
  margin: 1.5rem 0;
}
</style> 