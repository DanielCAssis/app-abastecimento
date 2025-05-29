<template>
  <div class="sobre-bg">
    <div class="sobre-card">
      <div class="sobre-logo">
        <img src="@/assets/logo1.png" alt="Logo Abastece Fácil" class="logo-img" />
      </div>
      <div class="sobre-title-block">
        <div class="sobre-title">Sobre o Abastece Fácil</div>
        <div class="sobre-subtitle">Controle de abastecimento para qualquer veículos</div>
      </div>
      <div class="sobre-text">
        <p>
          O <b>Abastece Fácil</b> nasceu da necessidade de motoristas comuns do dia a dia em controlar de forma simples e eficiente os abastecimentos, custos e autonomia dos seus veículos. Nosso objetivo é facilitar o dia a dia, trazendo tecnologia, praticidade e economia para quem depende do carro, moto ou frota.
        </p>
        <p>
          O sistema foi idealizado e desenvolvido por <b>Daniel Assis</b> e <b>Fellipe Nunes</b>, apaixonados por tecnologia e mobilidade, que sentiram na pele a dificuldade de organizar os gastos e lembretes de abastecimento. A ideia surgiu em 2025, unindo experiência em desenvolvimento de software e a vontade de criar uma solução útil para todos.
        </p>
        <p>
          Nossa missão é entregar uma plataforma intuitiva, segura e sempre em evolução, ouvindo nossos usuários e inovando para tornar o controle de abastecimento cada vez mais fácil.
        </p>
      </div>
      <div class="sobre-credits">
        <div class="sobre-credits-title">Criação & Desenvolvimento</div>
        <div class="sobre-credits-names">
          <span>Daniel Assis</span>
          <span>Fellipe</span>
        </div>
        <div class="sobre-credits-contact">
          <span><i class="pi pi-envelope"></i> suporte@assiscode.tech</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sobre-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7b5fff 0%, #3c8ce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}
.sobre-card {
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 32px #0001;
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 410px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sobre-logo {
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
.sobre-title-block {
  text-align: center;
  margin-bottom: 1.5rem;
}
.sobre-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.2rem;
  letter-spacing: 0.5px;
}
.sobre-subtitle {
  font-size: 1.05rem;
  color: #7b5fff;
  margin-bottom: 0.2rem;
}
.sobre-text {
  font-size: 1.05rem;
  color: #2d2357;
  margin-bottom: 1.5rem;
  text-align: justify;
  line-height: 1.6;
}
.sobre-credits {
  margin-top: 1.2rem;
  text-align: center;
}
.sobre-credits-title {
  font-size: 1.08rem;
  font-weight: 700;
  color: #2d2357;
  margin-bottom: 0.3rem;
}
.sobre-credits-names {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: #7b5fff;
  font-size: 1.01rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.sobre-credits-contact {
  color: #2d2357;
  font-size: 0.98rem;
  opacity: 0.85;
}
@media (max-width: 480px) {
  .sobre-card {
    max-width: 98vw;
    padding: 1.2rem 0.5rem 1.2rem 0.5rem;
    border-radius: 1.2rem;
  }
  .logo-img {
    width: 60px;
    height: 60px;
    border-radius: 12px;
  }
  .sobre-title {
    font-size: 1.05rem;
  }
  .sobre-subtitle {
    font-size: 0.95rem;
  }
}
</style> 