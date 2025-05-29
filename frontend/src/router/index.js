import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import PercursoView from '../views/PercursoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('../views/VehiclesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/fuelings',
      name: 'fuelings',
      component: () => import('../views/FuelingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/cadastro-veiculo',
      name: 'cadastro-veiculo',
      component: () => import('../views/CadastroVeiculo.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/combustiveis',
      name: 'Combustiveis',
      component: () => import('../views/CombustiveisView.vue')
    },
    {
      path: '/postos',
      name: 'Postos',
      component: () => import('../views/PostosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/locais',
      name: 'Locais',
      component: () => import('../views/LocaisView.vue')
    },
    {
      path: '/tipos-servico',
      name: 'TiposServico',
      component: () => import('../views/TiposServicoView.vue')
    },
    {
      path: '/meus-locais',
      name: 'MeusLocais',
      component: () => import('../views/MeusLocaisView.vue')
    },
    {
      path: '/configuracoes',
      name: 'Configuracoes',
      component: () => import('../views/ConfiguracoesView.vue')
    },
    {
      path: '/contato',
      name: 'Contato',
      component: () => import('../views/ContatoView.vue')
    },
    {
      path: '/sobre',
      name: 'Sobre',
      component: () => import('../views/SobreView.vue')
    },
    {
      path: '/percurso',
      name: 'percurso',
      component: PercursoView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router 