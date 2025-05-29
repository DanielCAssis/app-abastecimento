<template>
  <div class="config-bg">
    <div class="config-card">
      <div class="config-title-block">
        <div class="config-title">Configurações</div>
        <div class="config-subtitle">Personalize sua experiência</div>
      </div>
      <div class="config-section">
        <div class="config-section-title">Preferências do Usuário</div>
        <div class="config-user-info">
          <div class="config-user-field">
            <label>Nome</label>
            <div class="config-user-value">{{ nome }}</div>
          </div>
          <div class="config-user-field">
            <label>Email</label>
            <div class="config-user-value">{{ email }}</div>
          </div>
        </div>
      </div>
      <div class="config-section">
        <div class="config-section-title">Aparência</div>
        <div class="config-theme-toggle">
          <label for="toggle-dark">Modo escuro</label>
          <input id="toggle-dark" type="checkbox" v-model="darkMode" @change="toggleDarkMode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const nome = ref('')
const email = ref('')
const darkMode = ref(false)

onMounted(async () => {
  // Busca dados do usuário logado
  const userData = await authStore.fetchProfile()
  nome.value = userData?.nome || ''
  email.value = userData?.email || ''
  // Carrega preferência do modo escuro
  darkMode.value = localStorage.getItem('darkMode') === 'true'
  applyTheme()
})

function toggleDarkMode() {
  localStorage.setItem('darkMode', darkMode.value)
  applyTheme()
}

function applyTheme() {
  if (darkMode.value) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
}
</script>

<style scoped>
.config-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7b5fff 0%, #3c8ce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.config-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 32px #0001;
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.config-title-block {
  text-align: center;
  margin-bottom: 1.5rem;
}
.config-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}
.config-subtitle {
  font-size: 1.05rem;
  color: #7b5fff;
  margin-bottom: 0.2rem;
}
.config-section {
  width: 100%;
  margin-bottom: 1.5rem;
}
.config-section-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.7rem;
}
.config-user-info {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.config-user-field label {
  font-weight: 600;
  color: #2d2357;
  font-size: 1.01rem;
  margin-bottom: 0.1rem;
}
.config-user-value {
  font-size: 1.08rem;
  color: #7b5fff;
  background: #f5f6fa;
  border-radius: 0.8rem;
  padding: 0.5rem 1rem;
}
.config-theme-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.08rem;
  color: #2d2357;
  margin-top: 0.5rem;
}
.config-theme-toggle label {
  font-weight: 600;
}
.config-theme-toggle input[type="checkbox"] {
  width: 22px;
  height: 22px;
  accent-color: #7b5fff;
  border-radius: 0.5rem;
}
@media (max-width: 480px) {
  .config-card {
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    border-radius: 1.2rem;
  }
  .config-title {
    font-size: 1.05rem;
  }
  .config-subtitle {
    font-size: 0.95rem;
  }
}
</style>

<!-- Tema escuro global -->
<style>
.dark-mode {
  background: #181a20 !important;
}
.dark-mode .config-card {
  background: #23263a !important;
  color: #fff !important;
}
.dark-mode .config-title,
.dark-mode .config-section-title,
.dark-mode .config-user-field label {
  color: #fff !important;
}
.dark-mode .config-user-value {
  background: #23263a !important;
  color: #7b5fff !important;
}
.dark-mode .config-theme-toggle {
  color: #fff !important;
}
</style> 