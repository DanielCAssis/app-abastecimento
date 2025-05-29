<template>
  <div class="postos-view">
    <div class="container">
      <div class="description">
        <h2>Postos de Combustível Próximos</h2>
        <p>Encontre os postos mais próximos e planeje sua rota para abastecimento.</p>
      </div>

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
              <div v-if="postoSelecionado?.place_id === posto.place_id" class="station-actions">
                <Button
                  icon="pi pi-map"
                  label="Google Maps"
                  class="p-button-sm p-button-success mt-2 mr-2 google-maps-btn"
                  @click.stop="abrirGoogleMaps(posto)"
                />
                <Button
                  icon="pi pi-car"
                  label="Waze"
                  class="p-button-sm p-button-info mt-2 waze-btn"
                  @click.stop="abrirWaze(posto)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
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
      toast.add({
        severity: 'error',
        summary: 'Erro de Localização',
        detail: 'Não foi possível obter sua localização. Por favor, verifique as permissões do navegador.',
        life: 5000
      });
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
  postoSelecionado.value = posto;
  
  // Centralizar o mapa no posto selecionado
  map.value.setCenter(posto.geometry.location);
  map.value.setZoom(16);

  toast.add({
    severity: 'info',
    summary: 'Posto selecionado',
    detail: `Você pode traçar uma rota até ${posto.name}`,
    life: 3000
  });
};

// Função para verificar se pop-ups estão bloqueados
const verificarPopupBloqueado = () => {
  const popup = window.open('about:blank', '_blank');
  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    toast.add({
      severity: 'warn',
      summary: 'Pop-ups bloqueados',
      detail: 'Por favor, permita pop-ups para este site para abrir os aplicativos de navegação.',
      life: 5000
    });
    return false;
  }
  popup.close();
  return true;
};

// Função para abrir no Google Maps
const abrirGoogleMaps = (posto) => {
  if (!navigator.geolocation) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Geolocalização não suportada',
      life: 3000
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const origem = `${position.coords.latitude},${position.coords.longitude}`;
      const destino = `${posto.geometry.location.lat()},${posto.geometry.location.lng()}`;
      
      // Tenta abrir o app diretamente
      window.location.href = `comgooglemaps://?saddr=${origem}&daddr=${destino}&directionsmode=driving`;
      
      // Fallback para web em nova aba após 2 segundos
      setTimeout(() => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}&travelmode=driving`, '_blank');
      }, 2000);
    },
    (error) => {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível obter sua localização',
        life: 3000
      });
    }
  );
};

// Função para abrir no Waze
const abrirWaze = (posto) => {
  if (!navigator.geolocation) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Geolocalização não suportada',
      life: 3000
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = posto.geometry.location.lat();
      const lng = posto.geometry.location.lng();
      
      // Tenta abrir o app diretamente
      window.location.href = `waze://?ll=${lat},${lng}&navigate=yes`;
      
      // Fallback para web em nova aba após 2 segundos
      setTimeout(() => {
        window.open(`https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
      }, 2000);
    },
    (error) => {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível obter sua localização',
        life: 3000
      });
    }
  );
};

// Carregar o script do Google Maps
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2lfwyGnehINoCdBUCPIypiaOx_f4mwXk&libraries=places,directions`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    await loadGoogleMapsScript();
    initMap();
  } catch (error) {
    console.error('Erro ao carregar o Google Maps:', error);
  }
});
</script>

<style scoped>
.postos-view {
  padding: 1rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.description {
  margin-bottom: 1.5rem;
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

.station-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
}

.station-actions .p-button {
  flex: 1;
  height: 2.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  white-space: nowrap;
}

.station-actions .p-button i {
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.google-maps-btn {
  background-color: #34A853 !important;
  border-color: #34A853 !important;
}

.google-maps-btn:hover {
  background-color: #2E8B57 !important;
  border-color: #2E8B57 !important;
}

.waze-btn {
  background-color: #33CCFF !important;
  border-color: #33CCFF !important;
}

.waze-btn:hover {
  background-color: #0099CC !important;
  border-color: #0099CC !important;
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
  
  .station-actions {
    flex-direction: row;
    flex-wrap: nowrap;
  }
  
  .station-actions .p-button {
    width: auto;
    padding: 0.5rem;
  }
}
</style> 