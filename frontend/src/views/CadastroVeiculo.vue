<template>
  <div class="cadastro-veiculo-main">
    <h2 class="cadastro-veiculo-title">Cadastro de Veículo</h2>
    <!-- Nome do veículo -->
    <label class="cadastro-label" for="nome">Nome do veículo</label>
    <input
      id="nome"
      v-model="form.nome"
      class="cadastro-input"
      placeholder="Ex: Golfolas, Celta Nervoso, Fusquete..."
      maxlength="32"
      type="text"
    />
    <!-- Marca -->
    <label class="cadastro-label" for="marca">Marca</label>
    <AutoComplete
      v-model="selectedMarca"
      :suggestions="filteredMarcas"
      field="nome"
      placeholder="Digite ou selecione a marca"
      class="cadastro-input"
      @complete="onMarcaSearch"
      @change="fetchModelos"
    />
    <!-- Modelo -->
    <label class="cadastro-label" for="modelo">Modelo</label>
    <AutoComplete
      v-model="selectedModelo"
      :suggestions="filteredModelos"
      field="nome"
      placeholder="Digite ou selecione o modelo"
      class="cadastro-input"
      :disabled="!selectedMarca"
      @complete="onModeloSearch"
      @change="fetchAnos"
    />
    <!-- Ano -->
    <label class="cadastro-label" for="ano">Ano</label>
    <AutoComplete
      v-model="selectedAno"
      :suggestions="filteredAnos"
      field="nome"
      placeholder="Digite ou selecione o ano"
      class="cadastro-input"
      :disabled="!selectedModelo"
      @complete="onAnoSearch"
      @change="fetchDetalhes"
    />
    <!-- Detalhes FIPE -->
    <div v-if="detalhes" class="fipe-detalhes">
      <div><b>Marca:</b> {{ detalhes.Marca }}</div>
      <div><b>Modelo:</b> {{ detalhes.Modelo }}</div>
      <div><b>Ano:</b> {{ detalhes.AnoModelo }}</div>
      <div><b>Combustível:</b> {{ detalhes.Combustivel }}</div>
      <div><b>Valor:</b> {{ detalhes.Valor }}</div>
      <div><b>Código FIPE:</b> {{ detalhes.CodigoFipe }}</div>
    </div>
    <!-- Placa -->
    <label class="cadastro-label" for="placa">Placa <span class="cadastro-optional">(opcional)</span></label>
    <input id="placa" v-model="form.placa" class="cadastro-input" placeholder="Digite a placa" maxlength="10" type="text" />
    <!-- Cor -->
    <label class="cadastro-label" for="cor">Cor</label>
    <input id="cor" v-model="form.cor" class="cadastro-input" placeholder="Digite a cor do veículo" maxlength="20" type="text" />
    <!-- Tipo de combustível -->
    <label class="cadastro-label" for="combustivel">Tipo de combustível</label>
    <input id="combustivel" v-model="form.combustivel" class="cadastro-input" placeholder="Ex: Gasolina, Flex, Diesel..." maxlength="20" type="text" />
    <!-- Volume do tanque -->
    <label class="cadastro-label" for="tanque">Volume do tanque (L)</label>
    <input id="tanque" v-model="form.tanque" class="cadastro-input" placeholder="Ex: 50" min="0" type="number" />
    <!-- Unidade de distância -->
    <div class="toggle-row">
      <button type="button" :class="['toggle-btn', form.unidade === 'km' ? 'active' : '']" @click="form.unidade = 'km'">Quilômetros (km)</button>
      <button type="button" :class="['toggle-btn', form.unidade === 'mi' ? 'active' : '']" @click="form.unidade = 'mi'">Milhas (mi)</button>
    </div>
    <!-- Quilometragem Inicial -->
    <label class="cadastro-label" for="quilometragem">Quilometragem Inicial</label>
    <input id="quilometragem" v-model="form.quilometragem" class="cadastro-input" placeholder="Digite a quilometragem inicial" min="0" type="number" required />
    <!-- Chassi -->
    <label class="cadastro-label" for="chassi">Chassi <span class="cadastro-optional">(opcional)</span></label>
    <input id="chassi" v-model="form.chassi" class="cadastro-input" placeholder="Digite o chassi" maxlength="20" type="text" />
    <!-- Renavam -->
    <label class="cadastro-label" for="renavam">Renavam <span class="cadastro-optional">(opcional)</span></label>
    <input id="renavam" v-model="form.renavam" class="cadastro-input" placeholder="Digite o renavam" maxlength="20" type="text" />
    <!-- Ativo -->
    <div class="ativo-row">
      <span>Ativo</span>
      <input type="checkbox" v-model="form.ativo" />
    </div>
    <!-- Observação -->
    <label class="cadastro-label" for="obs">Observação</label>
    <textarea id="obs" v-model="form.obs" class="cadastro-input" rows="2" placeholder="Observações sobre o veículo..."></textarea>
    <button class="app-btn-main cadastro-btn" @click.prevent="salvarVeiculo">Salvar Veículo</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const marcas = ref([])
const modelos = ref([])
const anos = ref([])
const detalhes = ref(null)

const selectedMarca = ref(null)
const selectedModelo = ref(null)
const selectedAno = ref(null)

const filteredMarcas = ref([])
const filteredModelos = ref([])
const filteredAnos = ref([])

const toast = useToast()
const router = useRouter()

const form = ref({
  nome: '',
  placa: '',
  cor: '',
  combustivel: '',
  tanque: '',
  unidade: 'km',
  chassi: '',
  renavam: '',
  quilometragem: '',
  marca: '',
  modelo: '',
  ano: '',
  ativo: true,
  obs: ''
})

onMounted(async () => {
  const res = await fetch('/api/fipe/marcas')
  marcas.value = await res.json()
})

function onMarcaSearch(event) {
  const query = event.query?.toLowerCase() || ''
  filteredMarcas.value = marcas.value.filter(m => m.nome.toLowerCase().includes(query))
}

async function fetchModelos() {
  selectedModelo.value = null
  selectedAno.value = null
  detalhes.value = null
  if (!selectedMarca.value) return
  const res = await fetch(`/api/fipe/marcas/${selectedMarca.value.codigo}/modelos`)
  const data = await res.json()
  modelos.value = data.modelos
  filteredModelos.value = modelos.value
}

function onModeloSearch(event) {
  const query = event.query?.toLowerCase() || ''
  filteredModelos.value = modelos.value.filter(m => m.nome.toLowerCase().includes(query))
}

async function fetchAnos() {
  selectedAno.value = null
  detalhes.value = null
  if (!selectedMarca.value || !selectedModelo.value) return
  const res = await fetch(`/api/fipe/marcas/${selectedMarca.value.codigo}/modelos/${selectedModelo.value.codigo}/anos`)
  anos.value = await res.json()
  filteredAnos.value = anos.value
}

function onAnoSearch(event) {
  const query = event.query?.toLowerCase() || ''
  filteredAnos.value = anos.value.filter(a => a.nome.toLowerCase().includes(query))
}

async function fetchDetalhes() {
  detalhes.value = null
  if (!selectedMarca.value || !selectedModelo.value || !selectedAno.value) return
  const res = await fetch(`/api/fipe/marcas/${selectedMarca.value.codigo}/modelos/${selectedModelo.value.codigo}/anos/${selectedAno.value.codigo}`)
  detalhes.value = await res.json()
  // Preencher campos automáticos
  form.value.marca = detalhes.value.Marca
  form.value.modelo = detalhes.value.Modelo
  form.value.ano = detalhes.value.AnoModelo
  form.value.combustivel = detalhes.value.Combustivel
}

async function salvarVeiculo() {
  try {
    const payload = {
      nome_veiculo: form.value.nome,
      marca: form.value.marca || (detalhes.value?.Marca ?? ''),
      modelo: form.value.modelo || (detalhes.value?.Modelo ?? ''),
      ano: form.value.ano || (detalhes.value?.AnoModelo ?? ''),
      placa: form.value.placa,
      cor: form.value.cor,
      quilometragem_inicial: form.value.quilometragem,
      chassi: form.value.chassi,
      renavam: form.value.renavam,
      observacoes: form.value.obs,
      tamanho_tanque: form.value.tanque,
      combustivel: form.value.combustivel,
      ativo: form.value.ativo
    }
    await axios.post('/api/vehicles', payload)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Veículo cadastrado com sucesso!', life: 3000 })
    router.push('/vehicles')
  } catch (err) {
    console.error("Erro ao salvar veículo:", err);
    let errorMessage = 'Erro ao salvar veículo.';
    if (err.response && err.response.data && err.response.data.error) {
      errorMessage = err.response.data.error;
    } else if (err.message) {
      errorMessage = err.message;
    }
    toast.add({ severity: 'error', summary: 'Erro', detail: errorMessage, life: 4000 });
  }
}
</script>

<style scoped>
.cadastro-veiculo-main {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 0.7rem 2.2rem 0.7rem;
  width: 100vw;
  box-sizing: border-box;
}
.cadastro-veiculo-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2d2357;
  margin-bottom: 1.2rem;
  text-align: center;
}
.cadastro-label {
  font-size: 1.01rem;
  font-weight: 600;
  color: #2d2357;
  margin-bottom: 0.2rem;
  margin-left: 0.2rem;
  opacity: 0.85;
}
.cadastro-optional {
  color: #aaa;
  font-size: 0.95em;
  font-weight: 400;
}
.cadastro-input,
:deep(.p-autocomplete .p-inputtext) {
  width: 100%;
  margin-bottom: 1.1rem;
  border-radius: 1.2rem !important;
  font-size: 1.13rem !important;
  background: #f5f6fa !important;
  border: 1.5px solid #e0e0e0 !important;
  min-height: 44px;
  box-sizing: border-box;
  padding: 0 1.1rem !important;
  color: #2d2357;
}
:deep(.p-autocomplete) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}
:deep(.p-autocomplete .p-autocomplete-input-token) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
:deep(.p-autocomplete .p-inputtext:focus) {
  border: 1.5px solid #7b5fff !important;
  box-shadow: 0 0 0 2px #7b5fff22 !important;
}
.fipe-detalhes {
  background: #f5f6fa;
  border-radius: 1.1rem;
  padding: 1rem 1.2rem;
  margin-bottom: 1.1rem;
  font-size: 1.05rem;
  color: #2d2357;
  box-shadow: 0 2px 8px #7b5fff11;
}
.toggle-row {
  display: flex;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
}
.toggle-btn {
  flex: 1;
  border-radius: 1.2rem;
  font-weight: 700;
  font-size: 1.08rem;
  color: #7b5fff;
  border: 2px solid #7b5fff;
  background: #f5f6fa;
  padding: 0.7rem 0;
  transition: background 0.2s, color 0.2s;
}
.toggle-btn.active, .toggle-btn.active:focus {
  background: linear-gradient(90deg, #7b5fff 60%, #3c8ce7 100%);
  color: #fff;
  border: none;
}
.ativo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
  font-size: 1.08rem;
  font-weight: 600;
  color: #2d2357;
}
.cadastro-btn {
  margin-top: 1.5rem;
  width: 100%;
  min-height: 48px;
  font-size: 1.13rem;
  border-radius: 1.2rem;
  font-weight: 700;
  box-shadow: 0 2px 12px #7b5fff33;
  background: linear-gradient(90deg, #7b5fff 60%, #3c8ce7 100%);
  color: #fff;
  border: none;
}
.cadastro-btn:active {
  background: linear-gradient(90deg, #5f4bb6 60%, #2d2357 100%);
}
@media (max-width: 600px) {
  .cadastro-veiculo-main {
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
  }
}
</style>
