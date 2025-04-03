<template>
  <div class="home-page">
    <header class="hero">
      <h1>Bienvenido a SIHCE Consulta</h1>
      <p>Tu plataforma confiable para la gestión de consultas médicas.</p>
    </header>
    <section class="features">
      <div class="feature">
        <h2>Gestión Eficiente</h2>
        <p>Organiza y administra tus consultas de manera rápida y sencilla.</p>
      </div>
      <div class="feature">
        <h2>Acceso Seguro</h2>
        <p>Protegemos tus datos con los más altos estándares de seguridad.</p>
      </div>
      <div class="feature">
        <h2>Soporte 24/7</h2>
        <p>Estamos aquí para ayudarte en cualquier momento.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 20px;
}

.hero {
  background-color: #4CAF50;
  color: white;
  padding: 50px 20px;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

.feature {
  max-width: 300px;
  text-align: left;
}

.feature h2 {
  color: #4CAF50;
}
</style>