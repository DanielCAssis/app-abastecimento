<template>
  <div class="login-bg-new">
    <div class="login-card-new">
      <div class="login-logo-new no-bg">
        <img src="@/assets/logo1.png" alt="Logo App Abastecimento" class="logo-img" />
      </div>
      <div class="login-title-block">
        <div class="login-title-new">Bem-vindo ao,</div>
        <div class="app-name-login">Abastece Fácil</div>
      </div>
      <form @submit.prevent="handleSubmit" class="login-form-new">
        <div class="field-new">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="emailValue"
            type="email"
            class="login-input-new"
            :class="{ 'p-invalid': v$.emailValue.$error }"
            placeholder="Digite seu email"
            autocomplete="username"
          />
          <small class="p-error" v-if="v$.emailValue.$error">
            {{ v$.emailValue.$errors[0].$message }}
          </small>
        </div>
        <div class="field-new">
          <label for="password">Senha</label>
          <Password
            id="password"
            v-model="password"
            class="w-full"
            input-class="login-input-new"
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': v$.password.$error }"
            placeholder="Digite sua senha"
            autocomplete="current-password"
          />
          <small class="p-error" v-if="v$.password.$error">
            {{ v$.password.$errors[0].$message }}
          </small>
        </div>
        <Button
          type="submit"
          class="login-btn-new app-btn-main"
          :loading="loading"
        >
          <template #default>
            Entrar
            <span v-if="loading" class="custom-spinner">
              <i class="pi pi-spin pi-spinner"></i>
            </span>
          </template>
        </Button>
        <div class="register-link-new">
          <router-link to="/register">Não tem uma conta? <b>Registre-se</b></router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const emailValue = ref('')
const password = ref('')
const loading = ref(false)

const rules = {
  emailValue: { required, email },
  password: { required }
}

const v$ = useVuelidate(rules, { emailValue, password })

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  loading.value = true
  try {
    await authStore.login({
      email: emailValue.value,
      senha_hash: password.value
    })
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Login realizado com sucesso!',
      life: 3000
    })
    router.push('/')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.response?.data?.error || 'Erro ao realizar login',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  document.title = 'Abastece Fácil';
});
</script>

<style scoped>
.login-bg-new {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}
.login-card-new {
  background: #fff;
  border-radius: 2.5rem;
  box-shadow: 0 8px 32px #0001;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-logo-new {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
  box-shadow: none;
  width: 100%;
  height: auto;
}
.login-logo-new.no-bg {
  background: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}
.logo-img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  border-radius: 18px;
  background: transparent;
  display: block;
}
.login-title-block {
  text-align: center;
  margin-bottom: 2rem;
}
.login-title-new {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}
.app-name-login {
  font-size: 2rem;
  font-weight: 800;
  color: #7b5fff;
  margin-bottom: 0.2rem;
  text-align: center;
  letter-spacing: 0.5px;
}
.login-form-new {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}
.field-new label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #2d2357;
  font-size: 1.05rem;
}
.field-new {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.login-input-new {
  height: 48px !important;
  border-radius: 1.2rem !important;
  font-size: 1.13rem !important;
  padding: 0 1.1rem !important;
  background: #f5f6fa !important;
  border: 1.5px solid #e0e0e0 !important;
  box-sizing: border-box !important;
  transition: border 0.2s;
  line-height: 1.2 !important;
  display: block !important;
  width: 100% !important;
}
.login-input-new:focus {
  border: 1.5px solid #7b5fff !important;
  outline: none !important;
  box-shadow: 0 0 0 2px #f7c94833 !important;
}
:deep(.p-password) {
  width: 100% !important;
}
:deep(.p-password .login-input-new) {
  height: 48px !important;
  border-radius: 1.2rem !important;
  font-size: 1.13rem !important;
  padding: 0 1.1rem !important;
  background: #f5f6fa !important;
  border: 1.5px solid #e0e0e0 !important;
  box-sizing: border-box !important;
  transition: border 0.2s;
  line-height: 1.2 !important;
  display: block !important;
  width: 100% !important;
}
:deep(.p-password .login-input-new:focus) {
  border: 1.5px solid #7b5fff !important;
  outline: none !important;
  box-shadow: 0 0 0 2px #f7c94833 !important;
}
:deep(.p-password .p-input-icon) {
  right: 1.1rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  position: absolute !important;
  font-size: 1.3rem;
  color: #7b5fff !important;
}
.login-btn-new {
  width: 100%;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, #7b5fff 60%, #3c8ce7 100%);
  border: none;
  font-weight: 700;
  font-size: 1.15rem;
  border-radius: 1.2rem;
  height: 48px;
  letter-spacing: 0.5px;
  transition: background 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  box-shadow: 0 2px 12px #7b5fff33;
}
.login-btn-new:hover {
  background: linear-gradient(90deg, #5f4bb6 60%, #2d2357 100%);
}
.register-link-new {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.05rem;
}
.register-link-new a {
  color: #2d2357;
  text-decoration: none;
  transition: color 0.2s;
}
.register-link-new a b {
  color: #f7c948;
}
.register-link-new a:hover {
  color: #f7c948;
}
.custom-spinner {
  margin-left: 0.7rem;
  font-size: 1.1em;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
}
</style> 