<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import BottomNav from './components/BottomNav.vue'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.user?.nome || authStore.user?.name || 'Usuário')

const sidebarExpanded = ref(false)
const toggleSidebar = () => { sidebarExpanded.value = !sidebarExpanded.value }

const menuItems = [
  { label: 'Início', icon: 'pi pi-home', to: '/' },
  { label: 'Veículos', icon: 'pi pi-car', to: '/vehicles' },
  { label: 'Abastecimentos', icon: 'pi pi-chart-line', to: '/fuelings' },
  { label: 'Relatórios', icon: 'pi pi-chart-bar', to: '/reports' },
  { label: 'Sair', icon: 'pi pi-sign-out', command: () => { authStore.logout(); router.push('/login') } }
]

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const isMobile = ref(window.innerWidth <= 900)
function handleResize() { isMobile.value = window.innerWidth <= 900 }
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // Persistência do usuário logado
  if (authStore.token && !authStore.user) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
    authStore.fetchProfile()
  }
})
onUnmounted(() => { window.removeEventListener('resize', handleResize) })
</script>

<template>
  <div>
    <div v-if="isAuthenticated" class="app-layout">
      <aside v-if="!isMobile" :class="['sidebar', { expanded: sidebarExpanded }]">
        <button class="sidebar-toggle" @click="toggleSidebar" :aria-label="sidebarExpanded ? 'Recolher menu' : 'Expandir menu'">
          <i :class="sidebarExpanded ? 'pi pi-angle-left' : 'pi pi-bars'"></i>
        </button>
        <nav>
          <template v-for="item in menuItems" :key="item.label">
            <router-link v-if="item.to" :to="item.to" :title="item.label">
              <i :class="item.icon"></i>
              <span v-if="sidebarExpanded" class="sidebar-label">{{ item.label }}</span>
            </router-link>
            <a v-else @click="item.command" :title="item.label">
              <i :class="item.icon"></i>
              <span v-if="sidebarExpanded" class="sidebar-label">{{ item.label }}</span>
            </a>
          </template>
        </nav>
      </aside>
      <main :class="{ 'main-mobile': isMobile }">
        <section class="app-content">
          <router-view />
        </section>
      </main>
      <BottomNav />
      <Toast />
      <ConfirmDialog />
    </div>
    <div v-else>
      <router-view />
      <Toast />
      <ConfirmDialog />
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #2d2357;
  --secondary: #f5f6fa;
  --accent: #f7c948;
  --text: #22223b;
  --card-bg: #fff;
  --border-radius: 1.5rem;
}
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--secondary);
}
.sidebar {
  width: 72px;
  background: linear-gradient(135deg, #2d2357 80%, #3c8ce7 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem 0.5rem 1.2rem 0.5rem;
  gap: 2rem;
  box-shadow: 2px 0 8px #0001;
  transition: width 0.25s cubic-bezier(.4,2,.6,1), background 0.2s;
  position: relative;
  z-index: 10;
}
.sidebar.expanded {
  width: 210px;
  align-items: flex-start;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}
.sidebar-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 2.2rem;
  cursor: pointer;
  outline: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: color 0.2s;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}
.sidebar a, .sidebar .router-link-active {
  color: #fff;
  font-size: 1.5rem;
  transition: color 0.2s, background 0.2s;
  border-radius: 1rem;
  padding: 0.7rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  width: 100%;
  text-decoration: none;
  position: relative;
}
.sidebar a.router-link-active, .sidebar a:active {
  color: var(--accent) !important;
  background: #fff2;
}
.sidebar a .pi, .sidebar .router-link-active .pi {
  color: inherit !important;
}
.sidebar-label {
  font-size: 1 rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s;
}
.sidebar:not(.expanded) .sidebar-label {
  opacity: 0;
  width: 0;
  overflow: hidden;
  padding: 0;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.app-header {
  display: none;
}
.app-content {
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  min-height: 0;
}
.main-mobile {
  width: 100vw !important;
  max-width: 100vw !important;
  min-width: 100vw !important;
  background: #fff !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
@media (max-width: 900px) {
  .app-content { padding: 0 0 100px 0 !important; }
  .sidebar { display: none !important; }
  .sidebar.expanded {
    width: 200px;
    max-width: 200px;
    min-width: 190px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .sidebar nav {
    gap: 1rem;
  }
  .sidebar-label {
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
    display: inline-block;
  }
}
</style>
<style>
.app-btn-main {
  width: 100%;
  max-width: 240px;
  min-height: 48px;
  background: linear-gradient(90deg, #7b5fff 60%, #3c8ce7 100%);
  border: none;
  font-weight: 700;
  font-size: 1.08rem;
  border-radius: 1.2rem;
  color: #fff;
  box-shadow: 0 2px 12px #7b5fff33;
  padding: 0 1.5rem;
  letter-spacing: 0.01em;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.2s, box-shadow 0.2s;
  margin: 0 auto;
  gap: 0.6rem;
}
.app-btn-main:hover {
  background: linear-gradient(90deg, #5f4bb6 60%, #2d2357 100%);
  box-shadow: 0 4px 16px #7b5fff33;
}
.app-btn-main .pi {
  font-size: 1.2em;
  margin-right: 0.3em;
}
</style>
 