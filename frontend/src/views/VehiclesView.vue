<template>
  <div class="vehicles-bg">
    <div class="vehicles-header">
      <h2 class="vehicles-title"><i class="pi pi-car"></i> Veículos</h2>
      <Button label="Novo Veículo" icon="pi pi-plus" class="app-btn-main vehicles-btn-new" @click="goToCadastro" />
    </div>
    <div v-if="vehicles.length === 0" class="vehicles-empty">
      <i class="pi pi-car" style="font-size: 2.5rem; color: #7b5fff; margin-bottom: 1rem;"></i>
      <p>Nenhum veículo cadastrado ainda.</p>
      <Button label="Cadastrar Veículo" class="app-btn-main" icon="pi pi-plus" @click="goToCadastro" />
    </div>
    <div v-else class="vehicles-list">
      <Card v-for="v in vehicles" :key="v.id" class="vehicle-card">
        <template #content>
          <div class="vehicle-main-row">
            <span class="vehicle-nome">{{ v.nome_veiculo }}</span>
            <span class="vehicle-modelo">{{ v.modelo }}</span>
          </div>
          <div class="vehicle-info-row">
            <span class="vehicle-info-item"><i class="pi pi-calendar"></i> {{ v.ano }}</span>
            <span class="vehicle-info-item"><i class="pi pi-id-card"></i> {{ v.placa }}</span>
            <span class="vehicle-info-item"><i class="pi pi-tachometer"></i> {{ v.quilometragem_inicial?.toLocaleString('pt-BR') }} km</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import axios from 'axios'

const router = useRouter()
const vehicles = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/api/vehicles')
    vehicles.value = res.data
  } catch (err) {
    vehicles.value = []
  }
})

function goToCadastro() {
  router.push('/cadastro-veiculo')
}
</script>

<style scoped>
.vehicles-bg {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.5rem;
}
.vehicles-header {
  width: 100%;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 2rem; /* Adicione esta linha */
}
.vehicles-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #2d2357;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.vehicles-btn-new {
  min-width: 44px;
  min-height: 44px;
  font-size: 1.08rem;
  border-radius: 1.2rem;
  font-weight: 700;
  box-shadow: 0 2px 10px #7b5fff33;
  padding-left: 1rem;
  padding-right: 1rem;
}
.vehicles-empty {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 4px 24px #7b5fff22;
  padding: 2.2rem 1.2rem 2.2rem 1.2rem;
  width: 100%;
  max-width: 410px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin-top: 2.5rem;
}
.vehicles-list {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.vehicle-card {
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px #7b5fff22;
  background: #fff;
  padding: 1.2rem 1.1rem 1.2rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.vehicle-main-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}
.vehicle-nome {
  font-size: 1.18rem;
  font-weight: 800;
  color: #2d2357;
  margin-bottom: 0.1rem;
}
.vehicle-modelo {
  font-size: 1.05rem;
  color: #7b5fff;
  font-weight: 600;
}
.vehicle-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
  font-size: 1.01rem;
  color: #2d2357;
  align-items: center;
}
.vehicle-info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #f5f6fa;
  border-radius: 0.8rem;
  padding: 0.18rem 0.7rem;
}
@media (max-width: 600px) {
  .vehicles-header, .vehicles-empty, .vehicles-list {
    max-width: 98vw;
    padding: 0 0.3rem;
  }
  .vehicle-card {
    padding: 1rem 0.5rem 1rem 0.5rem;
  }
  .vehicle-info-row {
    gap: 0.5rem;
    font-size: 0.98rem;
  }
}
</style> 