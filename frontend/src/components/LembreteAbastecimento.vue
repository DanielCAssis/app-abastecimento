<template>
  <div class="lembrete-abastecimento">
    <Toast />
    <div v-if="lembrete && lembrete.necessitaLembrete" class="p-3 mb-3 border-round surface-100">
      <div class="flex align-items-center">
        <i class="pi pi-exclamation-triangle text-yellow-500 mr-2" style="font-size: 1.5rem"></i>
        <div class="flex-1">
          <h3 class="text-lg font-medium m-0 mb-2">Lembrete de Abastecimento</h3>
          <p class="m-0">{{ lembrete.mensagem }}</p>
          <div class="mt-2">
            <ProgressBar :value="lembrete.percentualRestante" :showValue="false" />
            <small class="text-500">
              {{ lembrete.percentualRestante.toFixed(1) }}% de combustível restante
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

const props = defineProps({
  idVeiculo: {
    type: Number,
    required: true
  },
  limitePercentual: {
    type: Number,
    default: 20
  }
});

const toast = useToast();
const lembrete = ref(null);

const verificarLembrete = async () => {
  try {
    const response = await axios.get(`/api/veiculos/${props.idVeiculo}/lembrete`, {
      params: {
        limitePercentual: props.limitePercentual
      }
    });
    
    lembrete.value = response.data;

    if (lembrete.value.necessitaLembrete) {
      toast.add({
        severity: 'warn',
        summary: 'Lembrete de Abastecimento',
        detail: lembrete.value.mensagem,
        life: 5000
      });
    }
  } catch (error) {
    console.error('Erro ao verificar lembrete:', error);
    if (error.response?.status !== 400) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível verificar o lembrete de abastecimento',
        life: 3000
      });
    }
  }
};

onMounted(() => {
  verificarLembrete();
});

watch(() => props.idVeiculo, () => {
  verificarLembrete();
});

// Verificar a cada 5 minutos
setInterval(verificarLembrete, 5 * 60 * 1000);
</script>

<style scoped>
.lembrete-abastecimento {
  width: 100%;
}
</style> 