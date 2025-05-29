<template>
  <div class="percurso-view">
    <div class="container">
      <div class="description">
        <h2>Calcular Percurso</h2>
        <p>Calcule o custo da sua viagem com base no consumo do veículo e preços de combustível.</p>
      </div>

      <div class="content-wrapper">
        <div class="form-container">
          <form @submit.prevent="calcularPercurso" class="percurso-form">
            <div class="form-group">
              <label for="origem">Origem</label>
              <InputText 
                id="origem" 
                v-model="origem" 
                placeholder="Obtendo sua localização..."
                :disabled="true"
                class="w-full"
              />
            </div>

            <div class="form-group">
              <label for="destino">Destino</label>
              <div class="input-with-button">
                <InputText 
                  id="destino" 
                  v-model="destino" 
                  placeholder="Digite o endereço de destino"
                  readonly
                  @click="abrirModalDestino"
                />
                <Button 
                  icon="pi pi-search" 
                  @click="abrirModalDestino"
                  class="p-button-secondary"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="veiculo">Veículo</label>
              <Dropdown
                id="veiculo"
                v-model="veiculoSelecionado"
                :options="veiculos"
                optionLabel="nome_veiculo"
                placeholder="Selecione o veículo"
                :loading="carregandoVeiculos"
              />
            </div>

            <div class="form-group">
              <label for="combustivel">Tipo de Combustível</label>
              <Dropdown
                id="combustivel"
                v-model="combustivelSelecionado"
                :options="tiposCombustivel"
                optionLabel="nome"
                placeholder="Selecione o combustível"
              />
            </div>

            <div class="form-group">
              <label>Incluir Pedágios</label>
              <div class="checkbox-group">
                <Checkbox v-model="incluirPedagios" :binary="true" />
                <span>Calcular custos de pedágio</span>
              </div>
            </div>

            <Button 
              type="submit" 
              label="Calcular Percurso" 
              class="p-button-primary"
              :loading="calculando"
            />
          </form>
        </div>

        <div v-if="resultadoCalculo" class="resultado-container">
          <div class="resultado-card">
            <h3>Resultado do Cálculo</h3>
            
            <div class="resultado-item">
              <i class="pi pi-map"></i>
              <div class="resultado-info">
                <span class="label">Distância Total</span>
                <span class="valor">{{ resultadoCalculo.distancia }}</span>
              </div>
            </div>

            <div class="resultado-item">
              <i class="pi pi-clock"></i>
              <div class="resultado-info">
                <span class="label">Tempo Estimado</span>
                <span class="valor">{{ resultadoCalculo.tempo }}</span>
              </div>
            </div>

            <div class="resultado-item">
              <i class="pi pi-car"></i>
              <div class="resultado-info">
                <span class="label">Consumo de Combustível</span>
                <span class="valor">{{ resultadoCalculo.consumo }} litros</span>
              </div>
            </div>

            <div class="resultado-item">
              <i class="pi pi-dollar"></i>
              <div class="resultado-info">
                <span class="label">Custo com Combustível</span>
                <span class="valor">R$ {{ resultadoCalculo.custoCombustivel }}</span>
              </div>
            </div>

            <div v-if="incluirPedagios" class="resultado-item">
              <i class="pi pi-ticket"></i>
              <div class="resultado-info">
                <span class="label">Custo com Pedágios</span>
                <span class="valor">R$ {{ resultadoCalculo.custoPedagios }}</span>
              </div>
            </div>

            <div class="resultado-item total">
              <i class="pi pi-wallet"></i>
              <div class="resultado-info">
                <span class="label">Custo Total</span>
                <span class="valor">R$ {{ resultadoCalculo.custoTotal }}</span>
              </div>
            </div>

            <div class="acoes-resultado">
              <Button 
                icon="pi pi-map" 
                label="Abrir no Google Maps" 
                class="p-button-success"
                @click="abrirGoogleMaps"
              />
              <Button 
                icon="pi pi-car" 
                label="Abrir no Waze" 
                class="p-button-info"
                @click="abrirWaze"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Busca de Destino -->
    <Dialog 
      v-model:visible="modalDestinoVisible" 
      modal 
      header="Buscar Destino" 
      :style="{width: '90vw', maxWidth: '500px'}"
      :closable="true"
    >
      <div class="modal-content">
        <InputText 
          v-model="buscaDestino" 
          placeholder="Digite o endereço de destino"
          class="w-full mb-3"
          @input="buscarEnderecos"
        />
        <div v-if="sugestoesEnderecos.length > 0" class="sugestoes-lista">
          <div 
            v-for="sugestao in sugestoesEnderecos" 
            :key="sugestao.place_id"
            class="sugestao-item"
            @click="selecionarEndereco(sugestao)"
          >
            {{ sugestao.description }}
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import axios from 'axios';

const toast = useToast();

// Estados do formulário
const origem = ref('');
const destino = ref('');
const veiculoSelecionado = ref(null);
const combustivelSelecionado = ref(null);
const incluirPedagios = ref(false);
const carregandoLocalizacao = ref(false);
const carregandoVeiculos = ref(false);
const calculando = ref(false);
const sugestoesEnderecos = ref([]);
const resultadoCalculo = ref(null);
const modalDestinoVisible = ref(false);
const buscaDestino = ref('');
let autocompleteService = null;
let geocoder = null;
let directionsService = null;

// Dados dos veículos e combustíveis
const veiculos = ref([]);
const tiposCombustivel = ref([
  { id: 1, nome: 'Gasolina Comum', preco: 5.89 },
  { id: 2, nome: 'Gasolina Aditivada', preco: 6.09 },
  { id: 3, nome: 'Etanol', preco: 4.29 },
  { id: 4, nome: 'Diesel', preco: 6.19 }
]);

// Carregar o script do Google Maps
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      initGoogleMapsServices();
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2lfwyGnehINoCdBUCPIypiaOx_f4mwXk&libraries=places,directions,geocoding`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGoogleMapsServices();
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Função para obter localização atual
const obterLocalizacaoAtual = async () => {
  if (!navigator.geolocation) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Geolocalização não suportada pelo seu navegador',
      life: 3000
    });
    return;
  }

  carregandoLocalizacao.value = true;

  try {
    await loadGoogleMapsScript();
    
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // Criar o mapa centralizado na localização do usuário
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    // Criar serviço Places
    const service = new google.maps.places.PlacesService(map);

    // Buscar endereço atual
    const request = {
      location: userLocation,
      radius: 100,
      language: 'pt-BR'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const endereco = results[0].vicinity || results[0].name;
        origem.value = endereco;
        toast.add({
          severity: 'success',
          summary: 'Localização atual',
          detail: endereco,
          life: 3000
        });
      } else {
        // Se não encontrar pelo Places, tenta pelo Geocoder
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: userLocation },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              const endereco = results[0].formatted_address;
              origem.value = endereco;
              toast.add({
                severity: 'success',
                summary: 'Localização atual',
                detail: endereco,
                life: 3000
              });
            } else {
              toast.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível obter o endereço',
                life: 3000
              });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível obter sua localização',
      life: 3000
    });
  } finally {
    carregandoLocalizacao.value = false;
  }
};

// Função para carregar veículos do usuário
const carregarVeiculos = async () => {
  carregandoVeiculos.value = true;
  try {
    const response = await axios.get('/api/vehicles');
    veiculos.value = response.data;
    
    // Carregar médias de consumo para cada veículo
    for (const veiculo of veiculos.value) {
      try {
        const mediaResponse = await axios.get(`/api/medias-consumo/${veiculo.id}`);
        veiculo.consumo = mediaResponse.data.media_consumo;
      } catch (error) {
        console.error(`Erro ao carregar média de consumo do veículo ${veiculo.id}:`, error);
        veiculo.consumo = null;
      }
    }

    // Seleciona o último veículo por padrão
    if (veiculos.value.length > 0) {
      veiculoSelecionado.value = veiculos.value[veiculos.value.length - 1];
    }
  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível carregar os veículos',
      life: 3000
    });
  } finally {
    carregandoVeiculos.value = false;
  }
};

// Função para abrir modal de destino
const abrirModalDestino = () => {
  modalDestinoVisible.value = true;
  buscaDestino.value = destino.value;
};

// Inicializar serviços do Google Maps
const initGoogleMapsServices = () => {
  if (!window.google) return;
  
  autocompleteService = new google.maps.places.AutocompleteService();
  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
};

// Observar mudanças no modal
watch(modalDestinoVisible, async (newValue) => {
  if (newValue) {
    try {
      await loadGoogleMapsScript();
      if (!autocompleteService) {
        initGoogleMapsServices();
      }
    } catch (error) {
      console.error('Erro ao carregar o Google Maps:', error);
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar os serviços do Google Maps',
        life: 3000
      });
    }
  }
});

// Função para buscar sugestões de endereços
const buscarEnderecos = async () => {
  if (!buscaDestino.value || buscaDestino.value.length < 3) {
    sugestoesEnderecos.value = [];
    return;
  }

  try {
    if (!autocompleteService) {
      await loadGoogleMapsScript();
      initGoogleMapsServices();
    }

    const request = {
      input: buscaDestino.value,
      componentRestrictions: { country: 'br' },
      language: 'pt-BR'
    };

    autocompleteService.getPlacePredictions(request, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        sugestoesEnderecos.value = predictions;
      } else {
        sugestoesEnderecos.value = [];
      }
    });
  } catch (error) {
    console.error('Erro ao buscar endereços:', error);
    sugestoesEnderecos.value = [];
  }
};

// Função para selecionar endereço das sugestões
const selecionarEndereco = (sugestao) => {
  destino.value = sugestao.description;
  buscaDestino.value = sugestao.description;
  sugestoesEnderecos.value = [];
  modalDestinoVisible.value = false;
  
  toast.add({
    severity: 'success',
    summary: 'Destino selecionado',
    detail: sugestao.description,
    life: 3000
  });
};

// Função para calcular o percurso
const calcularPercurso = async () => {
  if (!origem.value || !destino.value || !veiculoSelecionado.value || !combustivelSelecionado.value) {
    console.log('Valores atuais:', {
      origem: origem.value,
      destino: destino.value,
      veiculo: veiculoSelecionado.value,
      combustivel: combustivelSelecionado.value
    });
    
    toast.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Preencha todos os campos obrigatórios',
      life: 3000
    });
    return;
  }

  calculando.value = true;

  try {
    await loadGoogleMapsScript();
    if (!directionsService) {
      initGoogleMapsServices();
    }

    const result = await new Promise((resolve, reject) => {
      directionsService.route({
        origin: origem.value,
        destination: destino.value,
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK') {
          resolve(result);
        } else {
          reject(new Error('Não foi possível calcular a rota'));
        }
      });
    });

    // Extrair informações da rota
    const route = result.routes[0];
    const leg = route.legs[0];
    
    // Calcular consumo e custos
    const distanciaKm = leg.distance.value / 1000;
    const consumo = distanciaKm / veiculoSelecionado.value.consumo;
    const custoCombustivel = consumo * combustivelSelecionado.value.preco;
    const custoPedagios = incluirPedagios.value ? calcularPedagios(distanciaKm) : 0;

    resultadoCalculo.value = {
      distancia: leg.distance.text,
      tempo: leg.duration.text,
      consumo: consumo.toFixed(1),
      custoCombustivel: custoCombustivel.toFixed(2),
      custoPedagios: custoPedagios.toFixed(2),
      custoTotal: (custoCombustivel + custoPedagios).toFixed(2)
    };
  } catch (error) {
    console.error('Erro ao calcular percurso:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível calcular o percurso',
      life: 3000
    });
  } finally {
    calculando.value = false;
  }
};

// Função para calcular custos de pedágio (simplificada)
const calcularPedagios = (distanciaKm) => {
  // Média de R$ 0,30 por km em pedágios
  return distanciaKm * 0.30;
};

// Funções para abrir no Google Maps e Waze
const abrirGoogleMaps = () => {
  if (!origem.value || !destino.value) return;
  
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origem.value)}&destination=${encodeURIComponent(destino.value)}&travelmode=driving`;
  window.open(url, '_blank');
};

const abrirWaze = () => {
  if (!destino.value) return;
  
  const url = `https://www.waze.com/ul?q=${encodeURIComponent(destino.value)}&navigate=yes`;
  window.open(url, '_blank');
};

onMounted(async () => {
  await carregarVeiculos();
  await obterLocalizacaoAtual();
});
</script>

<style scoped>
.percurso-view {
  padding: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.description {
  margin-bottom: 2rem;
  text-align: center;
}

.description h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.description p {
  color: #666;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.form-container {
  flex: 1;
  min-width: 300px;
}

.percurso-form {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.sugestoes-lista {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sugestao-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sugestao-item:hover {
  background-color: #f5f5f5;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resultado-container {
  flex: 1;
  min-width: 300px;
}

.resultado-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resultado-card h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.resultado-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.resultado-item:last-child {
  border-bottom: none;
}

.resultado-item i {
  font-size: 1.5rem;
  color: #7b5fff;
}

.resultado-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resultado-info .label {
  font-size: 0.9rem;
  color: #666;
}

.resultado-info .valor {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.resultado-item.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #eee;
}

.resultado-item.total .valor {
  color: #7b5fff;
  font-size: 1.3rem;
}

.acoes-resultado {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.acoes-resultado .p-button {
  flex: 1;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .form-container,
  .resultado-container {
    width: 100%;
  }
  
  .acoes-resultado {
    flex-direction: column;
  }
}

.modal-content {
  padding: 1rem;
}

.sugestoes-lista {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.sugestao-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #eee;
}

.sugestao-item:last-child {
  border-bottom: none;
}

.sugestao-item:hover {
  background-color: #f5f5f5;
}

.w-full {
  width: 100%;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style> 