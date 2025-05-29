<template>
  <div class="seletor-posto">
    <Button
      label="Mostrar Postos Próximos"
      icon="pi pi-map-marker"
      @click="showMapDialog = true"
      class="w-full"
    />

    <div v-if="postoSelecionado" class="posto-selecionado mt-2">
      <div class="posto-info">
        <i class="pi pi-check-circle text-green-500 mr-2"></i>
        <span class="font-bold">{{ postoSelecionado.nome }}</span>
      </div>
      <div class="posto-endereco text-sm text-gray-600">
        {{ postoSelecionado.endereco }}
      </div>
    </div>

    <Dialog
      v-model:visible="showMapDialog"
      :modal="true"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      header="Postos de Gasolina Próximos"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    >
      <div class="content-wrapper">
        <div class="map-container">
          <div id="map" ref="mapContainer"></div>
        </div>
        <div class="stations-list">
          <h3>Postos Encontrados</h3>
          <div class="stations-list-content">
            <div v-if="postosEncontrados.length === 0" class="station-item">
              Nenhum posto encontrado nesta área.
            </div>
            <div
              v-for="(posto, index) in postosEncontrados"
              :key="posto.place_id"
              class="station-item"
              :class="{ 'nearest-station': index === 0 }"
              @click="selecionarPosto(posto)"
            >
              <div class="station-name">{{ posto.name }}</div>
              <div class="station-address">{{ posto.vicinity || 'Endereço não disponível' }}</div>
              <div v-if="posto.distance" class="station-distance">
                {{ posto.distance.toFixed(1) }} km
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const showMapDialog = ref(false);
const mapContainer = ref(null);
const map = ref(null);
const markers = ref([]);
const postosEncontrados = ref([]);
const postoSelecionado = ref(null);

// Função para calcular distância entre dois pontos
const calculateDistance = (point1, point2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Função para inicializar o mapa
const initMap = () => {
  if (!mapContainer.value) return;

  if (!navigator.geolocation) {
    console.error("Geolocalização não suportada pelo seu navegador");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Criar o mapa centralizado na localização do usuário
      map.value = new google.maps.Map(mapContainer.value, {
        center: userLocation,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      // Marcar a localização do usuário
      new google.maps.Marker({
        position: userLocation,
        map: map.value,
        title: "Você está aqui",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });

      // Criar serviço Places
      const service = new google.maps.places.PlacesService(map.value);

      // Buscar postos de gasolina próximos (até 2km)
      const request = {
        location: userLocation,
        radius: 2000,
        keyword: 'Posto de combustível',
        language: 'pt-BR'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Limpar marcadores existentes
          markers.value.forEach(marker => marker.setMap(null));
          markers.value = [];
          postosEncontrados.value = [];

          // Calcular distâncias e ordenar
          results.forEach(place => {
            place.distance = calculateDistance(
              userLocation,
              { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
            );
          });

          // Ordenar por distância
          results.sort((a, b) => a.distance - b.distance);

          results.forEach(place => {
            // Adicionar marcador para cada posto
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: map.value,
              title: place.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }
            });

            // Adicionar evento de clique no marcador
            marker.addListener('click', () => {
              selecionarPosto(place);
            });

            markers.value.push(marker);
            postosEncontrados.value.push(place);
          });
        } else {
          console.error("Não foi possível encontrar postos próximos:", status);
          postosEncontrados.value = [];
        }
      });
    },
    (error) => {
      console.error("Erro ao obter localização:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};

// Função para selecionar um posto
const selecionarPosto = (posto) => {
  // Atualizar o posto selecionado
  postoSelecionado.value = {
    nome: posto.name,
    endereco: posto.vicinity,
    latitude: posto.geometry.location.lat(),
    longitude: posto.geometry.location.lng()
  };

  // Emitir evento com o posto selecionado
  emit('select', postoSelecionado.value);

  // Fechar o modal
  showMapDialog.value = false;

  // Mostrar mensagem de sucesso
  toast.add({
    severity: 'success',
    summary: 'Posto selecionado',
    detail: `Você selecionou o posto ${posto.name}`,
    life: 3000
  });
};

// Carregar o script do Google Maps
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2lfwyGnehINoCdBUCPIypiaOx_f4mwXk&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Observar mudanças no dialog
watch(showMapDialog, async (newValue) => {
  if (newValue) {
    try {
      await loadGoogleMapsScript();
      // Inicializar mapa quando o dialog abrir
      setTimeout(() => {
        initMap();
      }, 100);
    } catch (error) {
      console.error('Erro ao carregar o Google Maps:', error);
    }
  } else {
    // Limpar mapa quando o dialog fechar
    if (map.value) {
      map.value = null;
      markers.value = [];
      postosEncontrados.value = [];
    }
  }
});

// Definir o emit
const emit = defineEmits(['select']);
</script>

<style scoped>
.seletor-posto {
  width: 100%;
}

.content-wrapper {
  display: flex;
  gap: 1rem;
  height: 600px;
}

.map-container {
  flex: 2;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.stations-list {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  overflow-y: auto;
}

.stations-list h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.station-item {
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.station-item:hover {
  background-color: #f5f5f5;
}

.station-name {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.3rem;
}

.station-address {
  font-size: 0.9rem;
  color: #666;
}

.station-distance {
  font-size: 0.9rem;
  color: #2c3e50;
  margin-top: 0.3rem;
  font-weight: bold;
}

.nearest-station {
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
}

.nearest-station:hover {
  background-color: #c8e6c9;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    height: auto;
  }
  
  .map-container {
    height: 400px;
  }
  
  .stations-list {
    height: 300px;
  }
}

.posto-selecionado {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.75rem;
}

.posto-info {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.posto-endereco {
  margin-left: 1.5rem;
}
</style> 