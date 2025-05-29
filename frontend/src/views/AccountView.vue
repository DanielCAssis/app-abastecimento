<template>
    <div class="minha-conta">
      <div class="header">
        <h1>Minha Conta</h1>
      </div>
  
      <div class="content">
        <!-- Foto de Perfil -->
        <div class="profile-photo">
          <div class="photo-container" @click="triggerFileInput">
            <img v-if="user.photo_url" :src="user.photo_url" alt="Foto de perfil" />
            <i v-else class="pi pi-user"></i>
            <div class="photo-overlay">
              <i class="pi pi-camera"></i>
            </div>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            style="display: none" 
            @change="handlePhotoUpload"
          />
        </div>
  
        <!-- Informações Pessoais -->
        <div class="section">
          <h2>Informações Pessoais</h2>
          <div class="user-info-nome">{{ user.nome }}</div>
          <div class="user-info-email">{{ user.email }}</div>
        </div>
  
        <!-- CNH -->
        <div class="section">
          <h2>CNH</h2>
          <div class="form-grid">
            <div class="field">
              <label>Número da CNH</label>
              <InputText v-model="user.cnh_number" />
            </div>
            <div class="field">
              <label>Categoria</label>
              <Dropdown 
                v-model="user.cnh_category" 
                :options="cnhCategories" 
                optionLabel="name"
                placeholder="Selecione a categoria"
              />
            </div>
            <div class="field">
              <label>Validade</label>
              <Calendar 
                v-model="user.cnh_expiration" 
                dateFormat="dd/mm/yy"
                :showIcon="true"
              />
            </div>
          </div>
        </div>
  
        <!-- Segurança -->
        <div class="section">
          <h2>Segurança</h2>
          <div class="form-grid">
            <div class="field">
              <Button 
                label="Alterar Senha" 
                icon="pi pi-lock" 
                @click="showChangePasswordDialog = true"
                class="p-button-outlined"
              />
            </div>
            <div class="field">
              <Button 
                label="Apagar Conta" 
                icon="pi pi-trash" 
                @click="showDeleteAccountDialog = true"
                class="p-button-danger p-button-outlined"
              />
            </div>
          </div>
        </div>
  
        <!-- Botão Salvar -->
        <div class="actions">
          <Button 
            label="Salvar Alterações" 
            icon="pi pi-save" 
            @click="saveChanges"
            :loading="saving"
          />
        </div>
      </div>
  
      <!-- Dialog Alterar Senha -->
      <Dialog 
        v-model:visible="showChangePasswordDialog" 
        header="Alterar Senha" 
        :modal="true"
        class="p-fluid"
      >
        <div class="form-grid">
          <div class="field">
            <label>Senha Atual</label>
            <Password v-model="password.current" :feedback="false" toggleMask />
          </div>
          <div class="field">
            <label>Nova Senha</label>
            <Password v-model="password.new" toggleMask />
          </div>
          <div class="field">
            <label>Confirmar Nova Senha</label>
            <Password v-model="password.confirm" :feedback="false" toggleMask />
          </div>
        </div>
        <template #footer>
          <Button 
            label="Cancelar" 
            icon="pi pi-times" 
            @click="showChangePasswordDialog = false" 
            class="p-button-text"
          />
          <Button 
            label="Alterar" 
            icon="pi pi-check" 
            @click="changePassword" 
            :loading="changingPassword"
          />
        </template>
      </Dialog>
  
      <!-- Dialog Apagar Conta -->
      <Dialog 
        v-model:visible="showDeleteAccountDialog" 
        header="Apagar Conta" 
        :modal="true"
      >
        <p>Você tem certeza que deseja apagar sua conta? Esta ação não pode ser desfeita.</p>
        <div class="field mt-4">
          <label>Digite sua senha para confirmar</label>
          <Password v-model="deleteAccountPassword" :feedback="false" toggleMask />
        </div>
        <template #footer>
          <Button 
            label="Cancelar" 
            icon="pi pi-times" 
            @click="showDeleteAccountDialog = false" 
            class="p-button-text"
          />
          <Button 
            label="Apagar Conta" 
            icon="pi pi-trash" 
            @click="deleteAccount" 
            class="p-button-danger"
            :loading="deletingAccount"
          />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '../stores/auth'
  import { useToast } from 'primevue/usetoast'
  import InputText from 'primevue/inputtext'
  
  const authStore = useAuthStore()
  const toast = useToast()
  
  // Estado do usuário
  const user = ref({
    nome: '',
    email: '',
    photo_url: null,
    cnh_number: '',
    cnh_category: null,
    cnh_expiration: null
  })
  
  // Estado dos diálogos
  const showChangePasswordDialog = ref(false)
  const showDeleteAccountDialog = ref(false)
  
  // Estado das operações
  const saving = ref(false)
  const changingPassword = ref(false)
  const deletingAccount = ref(false)
  
  // Referências
  const fileInput = ref(null)
  
  // Dados da senha
  const password = ref({
    current: '',
    new: '',
    confirm: ''
  })
  
  // Senha para apagar conta
  const deleteAccountPassword = ref('')
  
  // Categorias de CNH
  const cnhCategories = [
    { name: 'A', value: 'A' },
    { name: 'B', value: 'B' },
    { name: 'C', value: 'C' },
    { name: 'D', value: 'D' },
    { name: 'E', value: 'E' },
    { name: 'AB', value: 'AB' },
    { name: 'AC', value: 'AC' },
    { name: 'AD', value: 'AD' },
    { name: 'AE', value: 'AE' }
  ]
  
  // Carregar dados do usuário
  onMounted(async () => {
    try {
      const userData = await authStore.fetchProfile()
      user.value.nome = userData.nome || ''
      user.value.email = userData.email || ''
      user.value.photo_url = null
      user.value.cnh_number = ''
      user.value.cnh_category = null
      user.value.cnh_expiration = null
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar os dados do usuário',
        life: 3000
      })
    }
  })
  
  // Funções
  function triggerFileInput() {
    fileInput.value.click()
  }
  
  async function handlePhotoUpload(event) {
    const file = event.target.files[0]
    if (!file) return
  
    // TODO: Implementar upload da foto
    toast.add({
      severity: 'info',
      summary: 'Em desenvolvimento',
      detail: 'Upload de foto será implementado em breve',
      life: 3000
    })
  }
  
  async function saveChanges() {
    saving.value = true
    try {
      // TODO: Implementar salvamento das alterações
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Alterações salvas com sucesso',
        life: 3000
      })
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível salvar as alterações',
        life: 3000
      })
    } finally {
      saving.value = false
    }
  }
  
  async function changePassword() {
    if (password.value.new !== password.value.confirm) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhas não coincidem',
        life: 3000
      })
      return
    }
  
    changingPassword.value = true
    try {
      // TODO: Implementar alteração de senha
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha alterada com sucesso',
        life: 3000
      })
      showChangePasswordDialog.value = false
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível alterar a senha',
        life: 3000
      })
    } finally {
      changingPassword.value = false
    }
  }
  
  async function deleteAccount() {
    if (!deleteAccountPassword.value) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Digite sua senha para confirmar',
        life: 3000
      })
      return
    }
  
    deletingAccount.value = true
    try {
      // TODO: Implementar exclusão da conta
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível apagar a conta',
        life: 3000
      })
    } finally {
      deletingAccount.value = false
    }
  }
  </script>
  
  <style scoped>
  .minha-conta {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .header {
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .header h1 {
    color: #2d2357;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .content {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 12px #0001;
  }
  
  .section {
    margin-bottom: 2rem;
  }
  
  .section h2 {
    color: #2d2357;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .field label {
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .profile-photo {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  .photo-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #f5f6fa;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .photo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .photo-container i {
    font-size: 3rem;
    color: #7b5fff;
  }
  
  .photo-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .photo-container:hover .photo-overlay {
    opacity: 1;
  }
  
  .photo-overlay i {
    color: #fff;
    font-size: 1.5rem;
  }
  
  .actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  
  :deep(.p-button) {
    min-width: 200px;
  }
  
  :deep(.p-dialog) {
    max-width: 90vw;
    width: 500px;
  }
  
  @media (max-width: 600px) {
    .content {
      padding: 1rem;
    }
  
    .form-grid {
      grid-template-columns: 1fr;
    }
  
    :deep(.p-button) {
      width: 100%;
    }
  }
  
  .user-info-nome {
    font-size: 1.3rem;
    font-weight: 700;
    color: #7b5fff;
    text-align: center;
    margin-bottom: 0.2rem;
    letter-spacing: 0.5px;
  }
  .user-info-email {
    font-size: 1.05rem;
    color: #2d2357;
    text-align: center;
    margin-bottom: 1.2rem;
    opacity: 0.85;
  }
  </style> 