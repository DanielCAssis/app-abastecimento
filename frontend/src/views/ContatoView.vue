<template>
  <div class="contato-bg">
    <div class="contato-card">
      <div class="contato-logo">
        <img src="@/assets/logo1.png" alt="Logo Abastece Fácil" class="logo-img" />
      </div>
      <div class="contato-title-block">
        <div class="contato-title">Fale com a gente</div>
        <div class="contato-subtitle">Precisa de ajuda ou quer enviar uma sugestão?</div>
      </div>
      <form class="contato-form" @submit.prevent="enviarContato">
        <div class="contato-field">
          <label for="nome">Nome</label>
          <input id="nome" v-model="nome" class="contato-input" type="text" placeholder="Digite seu nome" required />
        </div>
        <div class="contato-field">
          <label for="email">Email</label>
          <input id="email" v-model="email" class="contato-input" type="email" placeholder="Digite seu email" required />
        </div>
        <div class="contato-field">
          <label for="mensagem">Mensagem</label>
          <textarea id="mensagem" v-model="mensagem" class="contato-input" rows="4" placeholder="Digite sua mensagem" required></textarea>
        </div>
        <button class="contato-btn" :disabled="enviando">{{ enviando ? 'Enviando...' : 'Enviar' }}</button>
      </form>
      <div class="contato-suporte">
        <div class="contato-suporte-title">Suporte</div>
        <div class="contato-suporte-info">
          <span><i class="pi pi-envelope"></i> suporte@assiscode.tech</span>
          <span><i class="pi pi-whatsapp"></i> (21) 9 9405-8227</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
const nome = ref('')
const email = ref('')
const mensagem = ref('')
const enviando = ref(false)
const toast = useToast()

function enviarContato() {
  enviando.value = true
  setTimeout(() => {
    toast.add({
      severity: 'success',
      summary: 'Mensagem enviada',
      detail: 'Obrigado pelo contato! Em breve responderemos.',
      life: 3500
    })
    nome.value = ''
    email.value = ''
    mensagem.value = ''
    enviando.value = false
  }, 1200)
}
</script>

<style scoped>
.contato-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7b5fff 0%, #3c8ce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.contato-card {
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
.contato-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.2rem;
}
.logo-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 18px;
  background: transparent;
  display: block;
}
.contato-title-block {
  text-align: center;
  margin-bottom: 1.5rem;
}
.contato-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}
.contato-subtitle {
  font-size: 1.05rem;
  color: #7b5fff;
  margin-bottom: 0.2rem;
}
.contato-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}
.contato-field label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #2d2357;
  font-size: 1.05rem;
}
.contato-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.contato-input {
  height: 44px;
  border-radius: 1.2rem;
  font-size: 1.08rem;
  padding: 0 1.1rem;
  background: #f5f6fa;
  border: 1.5px solid #e0e0e0;
  box-sizing: border-box;
  transition: border 0.2s;
  line-height: 1.2;
  display: block;
  width: 100%;
}
.contato-input:focus {
  border: 1.5px solid #7b5fff;
  outline: none;
  box-shadow: 0 0 0 2px #f7c94833;
}
.contato-input[type="textarea"], .contato-input textarea {
  min-height: 80px;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
}
.contato-btn {
  width: 100%;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, #7b5fff 60%, #3c8ce7 100%);
  border: none;
  font-weight: 700;
  font-size: 1.13rem;
  border-radius: 1.2rem;
  height: 44px;
  letter-spacing: 0.5px;
  transition: background 0.2s;
  color: #fff;
  box-shadow: 0 2px 12px #7b5fff33;
  cursor: pointer;
}
.contato-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.contato-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #5f4bb6 60%, #2d2357 100%);
}
.contato-suporte {
  margin-top: 1.2rem;
  text-align: center;
}
.contato-suporte-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.3rem;
}
.contato-suporte-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: #7b5fff;
  font-size: 1.01rem;
}
@media (max-width: 480px) {
  .contato-card {
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    border-radius: 1.2rem;
  }
  .logo-img {
    width: 60px;
    height: 60px;
    border-radius: 12px;
  }
  .contato-title {
    font-size: 1.05rem;
  }
  .contato-subtitle {
    font-size: 0.95rem;
  }
  .contato-btn {
    font-size: 1rem;
    height: 40px;
    border-radius: 0.8rem;
  }
}
</style> 