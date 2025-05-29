<template>
  <div class="card">
    <h2>{{ isEdit ? 'Editar' : 'Novo' }} Abastecimento</h2>

    <form @submit.prevent="salvarAbastecimento" class="p-fluid">
      <div class="grid">
        <!-- Veículo -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="veiculo">Veículo</label>
            <Dropdown
              id="veiculo"
              v-model="abastecimento.veiculo"
              :options="veiculos"
              optionLabel="nome"
              placeholder="Selecione o veículo"
              :class="{ 'p-invalid': submitted && !abastecimento.veiculo }"
              :disabled="isEdit"
            >
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <div>
                    <div class="font-medium">{{ slotProps.option.nome }}</div>
                    <div class="text-sm text-500">{{ slotProps.option.placa }}</div>
                  </div>
                </div>
              </template>
            </Dropdown>
            <small class="p-error" v-if="submitted && !abastecimento.veiculo">
              Veículo é obrigatório.
            </small>
          </div>
        </div>

        <!-- Data e Hora -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="data_hora">Data e Hora</label>
            <Calendar
              id="data_hora"
              v-model="abastecimento.data_hora"
              :showTime="true"
              :showSeconds="false"
              :class="{ 'p-invalid': submitted && !abastecimento.data_hora }"
            />
            <small class="p-error" v-if="submitted && !abastecimento.data_hora">
              Data e hora são obrigatórios.
            </small>
          </div>
        </div>

        <!-- Quilometragem -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="quilometragem">Quilometragem Atual</label>
            <InputNumber
              id="quilometragem"
              v-model="abastecimento.quilometragem_atual"
              :min="0"
              :class="{ 'p-invalid': submitted && !abastecimento.quilometragem_atual }"
            />
            <small class="p-error" v-if="submitted && !abastecimento.quilometragem_atual">
              Quilometragem é obrigatória.
            </small>
          </div>
        </div>

        <!-- Tipo de Combustível -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="tipo_combustivel">Tipo de Combustível</label>
            <Dropdown
              id="tipo_combustivel"
              v-model="abastecimento.tipo_combustivel"
              :options="tiposCombustivel"
              placeholder="Selecione o tipo"
              :class="{ 'p-invalid': submitted && !abastecimento.tipo_combustivel }"
            />
            <small class="p-error" v-if="submitted && !abastecimento.tipo_combustivel">
              Tipo de combustível é obrigatório.
            </small>
          </div>
        </div>

        <!-- Posto de Combustível -->
        <div class="col-12">
          <div class="field">
            <label for="posto">Posto de Combustível</label>
            <SeletorPosto
              v-model="abastecimento.posto"
              @preco-sugerido="atualizarPrecoLitro"
            />
            <small class="p-error" v-if="submitted && !abastecimento.posto">
              Posto é obrigatório.
            </small>
          </div>
        </div>

        <!-- Preço por Litro -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="preco_litro">Preço por Litro (R$)</label>
            <InputNumber
              id="preco_litro"
              v-model="abastecimento.preco_litro"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              :minFractionDigits="3"
              :maxFractionDigits="3"
              :class="{ 'p-invalid': submitted && !abastecimento.preco_litro }"
            />
            <small class="p-error" v-if="submitted && !abastecimento.preco_litro">
              Preço por litro é obrigatório.
            </small>
          </div>
        </div>

        <!-- Litros -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="litros">Quantidade (L)</label>
            <InputNumber
              id="litros"
              v-model="abastecimento.litros"
              :min="0"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :class="{ 'p-invalid': submitted && !abastecimento.litros }"
            />
            <small class="p-error" v-if="submitted && !abastecimento.litros">
              Quantidade é obrigatória.
            </small>
          </div>
        </div>

        <!-- Valor Total -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="valor_total">Valor Total (R$)</label>
            <InputNumber
              id="valor_total"
              v-model="abastecimento.valor_total"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :class="{ 'p-invalid': submitted && !abastecimento.valor_total }"
            />
            <small class="p-error" v-if="submitted && !abastecimento.valor_total">
              Valor total é obrigatório.
            </small>
          </div>
        </div>

        <!-- Tanque Cheio -->
        <div class="col-12">
          <div class="field-checkbox">
            <Checkbox
              id="tanque_cheio"
              v-model="abastecimento.tanque_cheio"
              :binary="true"
            />
            <label for="tanque_cheio">Tanque Cheio</label>
          </div>
        </div>
      </div>

      <div class="flex justify-content-end mt-4">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text mr-2"
          @click="voltar"
        />
        <Button
          type="submit"
          :label="isEdit ? 'Atualizar' : 'Salvar'"
          icon="pi pi-check"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';
import SeletorPosto from '@/components/SeletorPosto.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEdit = ref(false);
const submitted = ref(false);
const veiculos = ref([]);
const tiposCombustivel = [
  { label: 'Gasolina Comum', value: 'GASOLINA_COMUM' },
  { label: 'Gasolina Aditivada', value: 'GASOLINA_ADITIVADA' },
  { label: 'Etanol', value: 'ETANOL' },
  { label: 'Diesel', value: 'DIESEL' },
  { label: 'GNV', value: 'GNV' }
];

const abastecimento = ref({
  veiculo: null,
  data_hora: new Date(),
  quilometragem_atual: null,
  tipo_combustivel: null,
  posto: null,
  preco_litro: null,
  litros: null,
  valor_total: null,
  tanque_cheio: false
});

// Carregar veículos
const carregarVeiculos = async () => {
  try {
    const response = await axios.get('/api/veiculos');
    veiculos.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível carregar a lista de veículos',
      life: 3000
    });
  }
};

// Carregar abastecimento para edição
const carregarAbastecimento = async (id) => {
  try {
    const response = await axios.get(`/api/abastecimentos/${id}`);
    const data = response.data;
    
    abastecimento.value = {
      ...data,
      data_hora: new Date(data.data_hora),
      veiculo: veiculos.value.find(v => v.id === data.id_veiculo),
      posto: data.posto
    };
  } catch (error) {
    console.error('Erro ao carregar abastecimento:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível carregar os dados do abastecimento',
      life: 3000
    });
    router.push('/abastecimentos');
  }
};

// Atualizar preço por litro quando o posto sugerir
const atualizarPrecoLitro = (preco) => {
  if (preco) {
    abastecimento.value.preco_litro = preco;
  }
};

// Calcular valor total quando preço ou litros mudarem
watch(
  [() => abastecimento.value.preco_litro, () => abastecimento.value.litros],
  ([preco, litros]) => {
    if (preco && litros) {
      abastecimento.value.valor_total = preco * litros;
    }
  }
);

// Salvar abastecimento
const salvarAbastecimento = async () => {
  submitted.value = true;

  if (!validarFormulario()) {
    return;
  }

  try {
    const dados = {
      data_hora: abastecimento.value.data_hora,
      quilometragem_atual: abastecimento.value.quilometragem_atual,
      tipo_combustivel: abastecimento.value.tipo_combustivel,
      preco_litro: abastecimento.value.preco_litro,
      litros: abastecimento.value.litros,
      valor_total: abastecimento.value.valor_total,
      tanque_cheio: abastecimento.value.tanque_cheio,
      id_veiculo: abastecimento.value.veiculo.id,
      id_posto: abastecimento.value.posto.id
    };

    if (isEdit.value) {
      await axios.put(`/api/abastecimentos/${route.params.id}`, dados);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Abastecimento atualizado com sucesso',
        life: 3000
      });
    } else {
      await axios.post('/api/abastecimentos', dados);
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Abastecimento registrado com sucesso',
        life: 3000
      });
    }

    router.push('/abastecimentos');
  } catch (error) {
    console.error('Erro ao salvar abastecimento:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível salvar o abastecimento',
      life: 3000
    });
  }
};

// Validar formulário
const validarFormulario = () => {
  return (
    abastecimento.value.veiculo &&
    abastecimento.value.data_hora &&
    abastecimento.value.quilometragem_atual &&
    abastecimento.value.tipo_combustivel &&
    abastecimento.value.posto &&
    abastecimento.value.preco_litro &&
    abastecimento.value.litros &&
    abastecimento.value.valor_total
  );
};

// Voltar para lista
const voltar = () => {
  router.push('/abastecimentos');
};

onMounted(async () => {
  await carregarVeiculos();
  
  if (route.params.id) {
    isEdit.value = true;
    await carregarAbastecimento(route.params.id);
  }
});
</script>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.field-checkbox {
  margin-top: 1rem;
}

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-calendar) {
  width: 100%;
}

:deep(.p-inputnumber) {
  width: 100%;
}
</style> 