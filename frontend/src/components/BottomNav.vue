<template>
  <nav class="bottom-nav" v-if="show">
    <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
      <i class="pi pi-home"></i>
      <span>Principal</span>
    </router-link>
    <router-link to="/reports" class="nav-item" :class="{ active: isActive('/reports') }">
      <i class="pi pi-chart-bar"></i>
      <span>Relatórios</span>
    </router-link>
    <button class="nav-item nav-fab" @click="openFabMenu">
      <i class="pi pi-plus"></i>
    </button>
    <router-link to="/vehicles" class="nav-item" :class="{ active: isActive('/vehicles') }">
      <i class="pi pi-car"></i>
      <span>Veículos</span>
    </router-link>
    <button class="nav-item" @click="openMoreMenu">
      <i class="pi pi-ellipsis-h"></i>
      <span>Mais</span>
    </button>
    <!-- FAB Menu (mock) -->
    <div v-if="fabMenuOpen" class="fab-menu-overlay" @click="closeFabMenu">
      <transition name="fab-fade-slide">
        <div class="fab-menu">
          <button class="fab-menu-item abastecimento" @click.stop="goTo('/fuelings')">
            <span class="custom-fuel-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="13" height="20" rx="2"/><rect x="7" y="6" width="5" height="4" rx="1"/><path d="M16 6v7a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1"/><path d="M17 10h3"/></svg>
            </span>
            <span>Abastecimento</span>
          </button>
          <button class="fab-menu-item percurso" @click.stop="goTo('/percurso')">
            <i class="pi pi-map-marker"></i>
            <span>Percurso</span>
          </button>
        </div>
      </transition>
    </div>
    <!-- MENU MAIS -->
    <div v-if="moreMenuOpen" class="more-modal-overlay" @click.self="closeMoreMenu">
      <div class="more-modal">
        <button class="more-modal-close" @click="closeMoreMenu"><i class="pi pi-times"></i></button>
        <div class="more-modal-logo">
          <img src="@/assets/logo2.png" alt="Logo Abastece Fácil" class="logo2-img" />
        </div>
        <div class="more-modal-grid">
          <button class="more-modal-item" @click="goTo('/account')"><i class="pi pi-user"></i><span>Minha conta</span></button>
          <button class="more-modal-item" @click="goTo('/postos')"><i class="pi pi-map-marker"></i><span>Postos</span></button>
          <button class="more-modal-item" @click="goTo('/configuracoes')"><i class="pi pi-cog"></i><span>Configurações</span></button>
          <button class="more-modal-item" @click="goTo('/contato')"><i class="pi pi-envelope"></i><span>Contato</span></button>
          <button class="more-modal-item" @click="goTo('/sobre')"><i class="pi pi-info-circle"></i><span>Sobre</span></button>
          <button class="more-modal-item sair" @click="logout"><i class="pi pi-sign-out"></i><span>Sair</span></button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const fabMenuOpen = ref(false)
const moreMenuOpen = ref(false)

const show = computed(() => window.innerWidth <= 900)

function isActive(path) {
  return route.path === path
}
function openFabMenu() {
  fabMenuOpen.value = true
}
function closeFabMenu() {
  fabMenuOpen.value = false
}
function openMoreMenu() {
  moreMenuOpen.value = true
}
function closeMoreMenu() {
  moreMenuOpen.value = false
}
function goTo(path) {
  closeFabMenu()
  closeMoreMenu()
  router.push(path)
}
function logout() {
  closeFabMenu()
  closeMoreMenu()
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  background: #fff;
  box-shadow: 0 -2px 16px #0002;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  border-top-left-radius: 1.2rem;
  border-top-right-radius: 1.2rem;
}
.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #2d2357;
  font-size: 1.25rem;
  background: none;
  border: none;
  outline: none;
  transition: color 0.2s;
  padding: 0.2rem 0;
  cursor: pointer;
  position: relative;
  min-width: 0;
}
.nav-item span {
  font-size: 0.78rem;
  margin-top: 0.1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.nav-item.active, .nav-item.router-link-active {
  color: #7b5fff;
}
.nav-fab {
  background: linear-gradient(135deg, #7b5fff 60%, #f7c948 100%);
  color: #fff;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 2rem;
  margin-top: -32px;
  box-shadow: 0 4px 16px #7b5fff33;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 101;
  position: relative;
  transition: background 0.2s;
}
.nav-fab:active, .nav-fab:focus {
  background: linear-gradient(135deg, #5f4bb6 60%, #2d2357 100%);
}
.fab-menu-overlay {
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.fab-menu {
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px #0003;
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 80px;
  align-items: stretch;
  min-width: 180px;
}
.fab-menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  color: #2d2357;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
  min-width: 0;
  gap: 0.5rem;
  padding: 0.6rem 0.5rem;
  border-radius: 1rem;
}
.fab-menu-item span {
  font-size: 0.93rem;
  margin-top: 0;
  font-weight: 500;
  color: #2d2357;
  letter-spacing: 0.01em;
}
.custom-fuel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}
.fab-menu-item.abastecimento i { color: #7b5fff; }
.fab-menu-item.despesa i { color: #f7c948; }
.fab-menu-item.receita i { color: #3c8ce7; }
.fab-menu-item.servico i { color: #2d2357; }
.fab-menu-item.percurso i { color: #44337a; }

@media (min-width: 901px) {
  .bottom-nav { display: none; }
}

/* Animação do menu FAB */
.fab-fade-slide-enter-active, .fab-fade-slide-leave-active {
  transition: opacity 0.28s cubic-bezier(.4,2,.6,1), transform 0.28s cubic-bezier(.4,2,.6,1);
}
.fab-fade-slide-enter-from, .fab-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(32px) scale(0.98);
}
.fab-fade-slide-enter-to, .fab-fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.more-modal-overlay {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.28);
  z-index: 2002;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.22s cubic-bezier(.4,2,.6,1), opacity 0.22s;
}
.more-modal {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 32px #0003;
  padding: 1.1rem 0.7rem 1.1rem 0.7rem;
  min-width: 220px;
  max-width: 95vw;
  min-height: 120px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: auto;
  transition: box-shadow 0.18s, transform 0.22s cubic-bezier(.4,2,.6,1), opacity 0.22s;
}
.more-modal-close {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #888;
  cursor: pointer;
  z-index: 2;
  transition: color 0.18s;
}
.more-modal-close:hover {
  color: #e74c3c;
}
.more-modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.6rem;
  width: 100%;
  margin-top: 0.7rem;
}
.more-modal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #2d2357;
  background: #f5f6fa;
  border: none;
  border-radius: 0.8rem;
  padding: 0.7rem 0.2rem;
  transition: background 0.18s, color 0.18s;
  cursor: pointer;
  min-width: 0;
}
.more-modal-item i {
  font-size: 1.5rem;
  margin-bottom: 0.1rem;
}
.more-modal-item:hover {
  background: #7b5fff11;
  color: #7b5fff;
}
.more-modal-item.sair {
  color: #e74c3c;
}
.more-modal {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.22s, transform 0.22s cubic-bezier(.4,2,.6,1);
}
.more-modal-overlay[style*="display: none"] .more-modal {
  opacity: 0;
  transform: scale(0.97);
}
.more-modal-logo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.1rem;
  margin-top: 0.2rem;
}
.logo2-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 0;
  background: none;
  box-shadow: none;
  display: block;
}
</style> 