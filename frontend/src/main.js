import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useToast } from 'primevue/usetoast'

// Configuração do Axios
const backendUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
  : 'https://posto.assiscode.tech'
    
axios.defaults.baseURL = backendUrl;
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Interceptor global de erros do Axios
axios.interceptors.response.use(
  response => response,
  error => {
    // Toast global (PrimeVue)
    let toast
    try {
      toast = useToast()
    } catch {}
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      if (toast) {
        toast.add({
          severity: 'error',
          summary: 'Sessão expirada',
          detail: 'Faça login novamente.',
          life: 3000
        })
      }
      router.push('/login')
    } else if (error.response && toast) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.response.data?.error || 'Erro inesperado',
        life: 3000
      })
    }
    return Promise.reject(error)
  }
)

// PrimeVue
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Estilos globais
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Persistência do usuário logado
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
if (authStore.token && !authStore.user) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`
  authStore.fetchProfile()
}

app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)
app.use(router)
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true
})

app.mount('#app')
 