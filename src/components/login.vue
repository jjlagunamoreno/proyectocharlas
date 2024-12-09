<template>
  <div class="login-container">
    <!-- FORMULARIO DE LOGIN -->
    <div class="login-box">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <input type="text" v-model="username" required />
          <label>Usuario</label>
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required />
          <label>Contraseña</label>
        </div>
        <button type="submit" class="btn-login">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      // PROCESO DE LOGIN
      if (this.username && this.password) {
        alert(`Bienvenido, ${this.username}`);
      } else {
        alert("Por favor, completa todos los campos.");
      }
    },
  },
};
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e90ff, #ff6347);
  font-family: "Arial", sans-serif;
  overflow: hidden;
}

/* CAJA DE LOGIN */
.login-box {
  background: white;
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1.2s ease-in-out;
}

.login-box h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* GRUPO DE INPUTS */
.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group input {
  width: 100%;
  padding: 10px 10px 10px 0;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #ccc;
  background: transparent;
  outline: none;
  transition: border-color 0.3s ease;
}

.input-group label {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -10px;
  color: #ff6347;
  font-size: 14px;
}

.input-group input:focus {
  border-color: #ff6347;
}

/* BOTÓN DE LOGIN */
.btn-login {
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background: #1e90ff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-login:hover {
  background: #ff6347;
  transform: translateY(-2px);
}

.btn-login:active {
  transform: translateY(2px);
}

/* ANIMACIÓN DE FADE-IN */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
