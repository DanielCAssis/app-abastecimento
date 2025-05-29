<template>
  <div class="fueling-main">
    <h2 class="fueling-title">Abastecimento</h2>
    <!-- Data e Hora -->
    <div class="fueling-row">
      <div class="fueling-col">
        <label class="fueling-label" for="data"><i class="pi pi-calendar"></i> Data</label>
        <input id="data" v-model="form.data" class="fueling-input" type="date" />
      </div>
      <div class="fueling-col">
        <label class="fueling-label" for="hora"><i class="pi pi-clock"></i> Hora</label>
        <input id="hora" v-model="form.hora" class="fueling-input" type="time" />
      </div>
    </div>
    <!-- Quilometragem -->
    <label class="fueling-label" for="quilometragem"><i class="pi pi-tachometer"></i> Quilometragem</label>
    <input id="quilometragem" v-model="form.quilometragem" class="fueling-input" type="number" min="0" placeholder="Digite a quilometragem" />
    <!-- Combustível -->
    <label class="fueling-label" for="combustivel"><i class="pi pi-gas-pump"></i> Combustível</label>
    <select id="combustivel" v-model="form.combustivel" class="fueling-input">
      <option value="">Selecione</option>
      <option value="Gasolina">Gasolina</option>
      <option value="Etanol">Etanol</option>
      <option value="Diesel">Diesel</option>
      <option value="GNV">GNV</option>
      <option value="Flex">Flex</option>
      <option value="Outro">Outro</option>
    </select>
    <!-- Preço, Valor, Litros -->
    <div class="fueling-row fueling-row-3">
      <div class="fueling-col">
        <label class="fueling-label" for="preco"><i class="pi pi-money-bill"></i> Preço/L</label>
        <input id="preco" :value="form.preco !== '' ? formatarNumero(form.preco) : ''" class="fueling-input" type="text" inputmode="decimal" pattern="[0-9]*" placeholder="0,00" @input="e => mascaraMonetaria('preco', e)" />
      </div>
      <div class="fueling-col">
        <label class="fueling-label" for="valor"><i class="pi pi-wallet"></i> Valor total</label>
        <input id="valor" :value="form.valor !== '' ? formatarNumero(form.valor) : ''" class="fueling-input" type="text" inputmode="decimal" pattern="[0-9]*" placeholder="0,00" @input="e => mascaraMonetaria('valor', e)" />
      </div>
      <div class="fueling-col">
        <label class="fueling-label" for="litros"><i class="pi pi-filter"></i> Litros</label>
        <input id="litros" :value="form.litros !== '' ? formatarNumero(form.litros) : ''" class="fueling-input" type="text" inputmode="decimal" pattern="[0-9]*" placeholder="0,00" @input="e => mascaraMonetaria('litros', e)" />
      </div>
    </div>
    <!-- Completar tanque -->
    <div class="custom-toggle-switch">
      <span class="toggle-label-text"><i class="pi pi-gas-pump"></i> Encheu o tanque?</span>
      <input
        type="checkbox"
        id="toggle-tanque"
        v-model="form.completo"
      />
      <label for="toggle-tanque"></label>
    </div>
    <!-- Posto de combustível -->
    <label class="fueling-label" for="posto"><i class="pi pi-map-marker"></i> Posto de combustível</label>
    <SeletorPosto v-model="form.postoSelecionado" />
    <!-- Veículo -->
    <label class="fueling-label" for="veiculo"><i class="pi pi-car"></i> Veículo</label>
    <select id="veiculo" v-model="form.veiculo" class="fueling-input">
      <option v-for="v in vehicles" :key="v.id" :value="v.id">{{ v.nome_veiculo }}</option>
    </select>
    <button class="fueling-btn" @click.prevent="salvarAbastecimento">SALVAR</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import SeletorPosto from '@/components/SeletorPosto.vue'

const form = ref({
  data: '',
  hora: '',
  quilometragem: '',
  combustivel: '',
  preco: '',
  valor: '',
  litros: '',
  completo: false,
  postoSelecionado: null,
  veiculo: ''
})

const vehicles = ref([])
const toast = useToast()
const router = useRouter()

onMounted(async () => {
  // Data e hora atuais
  const now = new Date()
  form.value.data = now.toISOString().slice(0, 10)
  form.value.hora = now.toTimeString().slice(0, 5)
  // Buscar veículos do backend
  try {
    const res = await axios.get('/api/vehicles')
    vehicles.value = res.data
    // Seleciona o último veículo por padrão
    form.value.veiculo = vehicles.value.length ? vehicles.value[vehicles.value.length - 1].id : ''
  } catch (err) {
    vehicles.value = []
  }
})

/** Função utilitária para formatar número com vírgula */
function formatarNumero(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const num = Number(String(valor).replace(/[^\d,\.]/g, '').replace(',', '.'));
  if (isNaN(num)) return '';
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mascaraMonetaria(campo, e) {
  let valor = e.target.value.replace(/\D/g, '');
  if (!valor) valor = '0';
  // Limita a 8 dígitos para evitar overflow
  valor = valor.slice(0, 8);
  // Formata para duas casas decimais
  let num = (parseInt(valor, 10) / 100).toFixed(2);
  // Atualiza o input e o form
  e.target.value = num.replace('.', ',');
  form.value[campo] = parseFloat(num);
  calcularCampos(campo);
}

function calcularCampos(origem) {
  const { preco, valor, litros } = form.value
  if (origem === 'preco' && preco && valor) {
    form.value.litros = +(valor / preco).toFixed(2)
  } else if (origem === 'valor' && preco && valor) {
    form.value.litros = +(valor / preco).toFixed(2)
  } else if (origem === 'litros' && preco && litros) {
    form.value.valor = +(preco * litros).toFixed(2)
  }
}

async function salvarAbastecimento() {
  try {
    const payload = {
      data_hora: form.value.data + ' ' + form.value.hora,
      quilometragem_atual: form.value.quilometragem,
      combustivel: form.value.combustivel,
      preco_litro: form.value.preco,
      valor_total: form.value.valor,
      litros: form.value.litros,
      tanque_cheio: form.value.completo,
      posto: form.value.postoSelecionado ? form.value.postoSelecionado.nome : '',
      id_veiculo: form.value.veiculo
    }
    await axios.post('/api/fuelings', payload)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Abastecimento salvo!', life: 3000 })
    router.push('/fuelings')
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro', detail: err.response?.data?.error || 'Erro ao salvar abastecimento', life: 4000 })
  }
}
</script>

<style scoped>
.fueling-main {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 0.7rem 2.2rem 0.7rem;
  width: 100vw;
  box-sizing: border-box;
}
.fueling-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #e89c0c;
  margin-bottom: 1.2rem;
  text-align: center;
}
.fueling-label {
  font-size: 1.01rem;
  font-weight: 600;
  color: #2d2357;
  margin-bottom: 0.2rem;
  margin-left: 0.2rem;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.fueling-input {
  width: 100%;
  margin-bottom: 1.1rem;
  border-radius: 1.2rem;
  font-size: 1.13rem;
  background: #f5f6fa;
  border: 1.5px solid #e0e0e0;
  min-height: 44px;
  box-sizing: border-box;
  padding: 0 1.1rem;
  color: #2d2357;
}
.fueling-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.1rem;
}
.fueling-row > .fueling-col {
  flex: 1 1 0;
  min-width: 0;
  width: 50%;
}
.fueling-row-3 {
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
}
.fueling-row-3 > .fueling-col {
  flex: 1 1 0;
  min-width: 0;
  width: 33.33%;
}
.fueling-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.fueling-switch-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.1rem;
  font-size: 1.08rem;
  font-weight: 600;
  color: #2d2357;
}
.fueling-switch-label {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.08rem;
  font-weight: 600;
  color: #2d2357;
  cursor: pointer;
  line-height: 1.1;
}
.fueling-switch-label i {
  margin-right: 0.4rem;
  font-size: 1.1em;
}
.fueling-switch-toggle {
  margin-left: 0.1rem;
  --inputswitch-width: 2rem;
  --inputswitch-height: 1.1rem;
  vertical-align: middle;
  align-self: center;
}
.fueling-btn {
  margin-top: 1.5rem;
  width: 100%;
  min-height: 48px;
  font-size: 1.13rem;
  border-radius: 1.2rem;
  font-weight: 700;
  box-shadow: 0 2px 12px #e89c0c33;
  background: linear-gradient(90deg, #e89c0c 60%, #ffb347 100%);
  color: #fff;
  border: none;
}
.fueling-btn:active {
  background: linear-gradient(90deg, #b97a0c 60%, #e89c0c 100%);
}
@media (max-width: 600px) {
  .fueling-main {
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
  }
  .fueling-row {
    gap: 1.7rem;
  }
  .fueling-row > .fueling-col {
    width: 48%;
    min-width: 120px;
  }
  .fueling-row-3 {
    flex-direction: column;
    gap: 0.5rem;
  }
  .fueling-row-3 > .fueling-col {
    width: 100%;
    min-width: 0;
  }
  .fueling-input {
    font-size: 1rem;
    padding: 0 0.7rem;
    min-height: 38px;
  }
}

.custom-toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.custom-toggle-switch input[type="checkbox"] {
  display: none;
}

.custom-toggle-switch label {
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: 1.4em;
  width: 2.7em;
  background: #e74c3c;
  border-radius: 1.4em;
  transition: background 0.3s;
  vertical-align: middle;
}

.custom-toggle-switch label:before {
  content: '';
  position: absolute;
  top: 0.15em;
  left: 0.15em;
  width: 1.1em;
  height: 1.1em;
  background: #fff;
  border-radius: 50%;
  transition: left 0.3s, background 0.3s;
  z-index: 2;
  box-shadow: 0 1px 4px #0001;
}

.custom-toggle-switch input[type="checkbox"]:checked + label {
  background: #27ae60;
}

.custom-toggle-switch input[type="checkbox"]:checked + label:before {
  left: 1.45em;
  background: #fff;
}

.toggle-label-text {
  font-size: 1.08rem;
  font-weight: 600;
  color: #2d2357;
  margin-left: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
</style> 