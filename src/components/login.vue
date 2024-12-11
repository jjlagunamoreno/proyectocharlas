<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <!-- INPUT PARA USUARIO -->
        <div class="input-wrapper">
          <input type="text" v-model="username" placeholder=" " required />
          <label>Usuario</label>
        </div>
        <!-- INPUT PARA CONTRASEÑA -->
        <div class="input-wrapper">
          <input type="password" v-model="password" placeholder=" " required />
          <label>Contraseña</label>
        </div>
        <!-- BOTÓN -->
        <button type="submit" class="btn-submit">Entrar</button>
      </form>
      <!-- OPCIÓN REGISTRARSE -->
      <p class="register-link">
        ¿No tienes una cuenta? <a href="#" @click="register">Regístrate</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MinimalLoginComponent",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      // SIMULA PROCESO DE LOGIN
      if (this.username && this.password) {
        alert(`Bienvenido, ${this.username}`);
      } else {
        alert("Por favor, completa todos los campos.");
      }
    },
    register() {
      alert("Redirigiendo a la página de registro...");
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
  background: linear-gradient(120deg, #2980b9, #6dd5fa);
  font-family: "Arial", sans-serif;
}

/* TARJETA DE LOGIN */
.login-card {
  background: white;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: slide-in 0.8s ease-out;
}

.login-card h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #444;
}

/* ESTILO DE INPUTS */
.input-wrapper {
  position: relative;
  margin-bottom: 25px;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 10px 10px 5px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #ddd;
  background: transparent;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: -10px;
  font-size: 14px;
  color: #2980b9;
}

.input-wrapper input:focus {
  border-bottom-color: #2980b9;
}

/* BOTÓN DE SUBMIT */
.btn-submit {
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #2980b9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-submit:hover {
  background: #6dd5fa;
  transform: translateY(-2px);
}

.btn-submit:active {
  transform: translateY(2px);
}

/* ENLACE DE REGISTRO */
.register-link {
  margin-top: 15px;
  font-size: 14px;
  color: #777;
}

.register-link a {
  color: #2980b9;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #6dd5fa;
}

/* ANIMACIÓN DE ENTRADA */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
