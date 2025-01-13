import React, { useRef, useState } from "react";
import style from "./login.css";
import logo from "../../assets/images/logoTajamar.png";
import flecha from "../../assets/images/right-arrow-alt-regular-24.png";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import Global from "../../utils/Global";

const Login = ({ setIsAuthenticated }) => {
  // ESTADO PARA LOS DATOS DEL LOGIN
  const [credentials, setCredentials] = useState({ userName: "", password: "" });

  // ESTADO PARA LOS DATOS DEL REGISTRO
  const [registerData, setRegisterData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    codigoCurso: "",
  });

  // ESTADO PARA LOS MENSAJES DE ERROR
  const [error, setError] = useState("");

  // NAVEGACIÓN PARA REDIRIGIR AL HOME DESPUÉS DEL LOGIN
  const navigate = useNavigate();

  // REFERENCIAS PARA MANIPULAR ESTILOS DEL FORMULARIO
  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);
  const col1Ref = useRef(null);
  const loginBtnRef = useRef(null);
  const registerBtnRef = useRef(null);

  // FUNCIÓN PARA MANEJAR CAMBIOS EN EL FORMULARIO DE LOGIN
  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // FUNCIÓN PARA MANEJAR CAMBIOS EN EL FORMULARIO DE REGISTRO
  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  // FUNCIÓN PARA ENVIAR LOS DATOS DE LOGIN A LA API
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // PREVENIR EL COMPORTAMIENTO POR DEFECTO DEL FORMULARIO
    try {
      // LLAMADA AL MÉTODO LOGIN EN ApiService
      const { token } = await ApiService.login(credentials);
      if (token) {
        // GUARDAR EL TOKEN EN GLOBAL
        Global.token = `Bearer ${token}`;
        setIsAuthenticated(true); // ACTUALIZAR EL ESTADO DE AUTENTICACIÓN
        navigate("/"); // REDIRIGIR AL HOME
      }
    } catch (err) {
      setError("Credenciales incorrectas"); // MENSAJE DE ERROR EN CASO DE FALLA
    }
  };

  // FUNCIÓN PARA ENVIAR LOS DATOS DE REGISTRO A LA API
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); // PREVENIR EL COMPORTAMIENTO POR DEFECTO DEL FORMULARIO
    try {
      // CREAR EL CUERPO DE LA SOLICITUD PARA EL REGISTRO
      const requestBody = {
        idUsuario: 0, // EL ID SE GENERA AUTOMÁTICAMENTE EN LA API
        nombre: registerData.nombre,
        apellidos: registerData.apellidos,
        email: registerData.email,
        estadoUsuario: true, // POR DEFECTO EL USUARIO ESTÁ ACTIVO
        imagen: "imagen.png", // IMAGEN PREDETERMINADA
        password: registerData.password,
        idRole: 2, // ROL PARA ALUMNOS
      };

      // LLAMADA AL MÉTODO registerAlumno EN ApiService
      await ApiService.registerAlumno(registerData.codigoCurso, requestBody);

      alert("Registro exitoso. Ahora puedes iniciar sesión.");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("No se pudo completar el registro."); // MENSAJE DE ERROR EN CASO DE FALLA
    }
  };

  // FUNCIÓN PARA MOSTRAR EL FORMULARIO DE LOGIN
  const handleLoginClick = () => {
    loginBtnRef.current.style.backgroundColor = "#21264D";
    registerBtnRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    loginFormRef.current.style.left = "50%";
    registerFormRef.current.style.left = "-50%";
    loginFormRef.current.style.opacity = 1;
    registerFormRef.current.style.opacity = 0;
    col1Ref.current.style.borderRadius = "20px 30% 20% 20px";
  };

  // FUNCIÓN PARA MOSTRAR EL FORMULARIO DE REGISTRO
  const handleRegisterClick = () => {
    loginBtnRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtnRef.current.style.backgroundColor = "#21264D";
    loginFormRef.current.style.left = "150%";
    registerFormRef.current.style.left = "50%";
    loginFormRef.current.style.opacity = 0;
    registerFormRef.current.style.opacity = 1;
    col1Ref.current.style.borderRadius = "20px 20% 30% 20px";
  };

  return (
    <div className="cuerpoLogin">
      <div className="form-container">
        {/* COLUMNA IZQUIERDA CON IMAGEN Y TEXTO */}
        <div className="col col-1" ref={col1Ref}>
          <div className="image-layer">
            <img src={logo} className="form-image-main" alt="Logo Tajamar" />
          </div>
          <p className="featured-words">
            Login de Gestión de charlas. <span>Tajamar</span>
          </p>
        </div>

        {/* COLUMNA DERECHA CON LOS FORMULARIOS */}
        <div className="col col-2">
          {/* BOTONES PARA CAMBIAR ENTRE LOGIN Y REGISTRO */}
          <div className="btn-box">
            <button
              className="btn btn-1"
              id="login"
              ref={loginBtnRef}
              onClick={handleLoginClick}
            >
              Iniciar Sesión
            </button>
            <button
              className="btn btn-1"
              id="register"
              ref={registerBtnRef}
              onClick={handleRegisterClick}
            >
              Registrarse
            </button>
          </div>

          {/* FORMULARIO DE LOGIN */}
          <div className="login-form" ref={loginFormRef}>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-input">
                <input
                  type="text"
                  name="userName"
                  className="input-field"
                  placeholder="Usuario"
                  value={credentials.userName}
                  onChange={handleChangeLogin}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="Contraseña"
                  value={credentials.password}
                  onChange={handleChangeLogin}
                  required
                />
                <button type="submit" className="input-submit">
                  <span>Iniciar sesión</span>
                  <img src={flecha} alt="flecha" />
                </button>
              </div>
              {error && <p>{error}</p>}
            </form>
          </div>

          {/* FORMULARIO DE REGISTRO */}
          <div className="register-form" ref={registerFormRef}>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-input">
                <input
                  type="text"
                  name="nombre"
                  className="input-field"
                  placeholder="Nombre"
                  value={registerData.nombre}
                  onChange={handleChangeRegister}
                  required
                />
                <input
                  type="text"
                  name="apellidos"
                  className="input-field"
                  placeholder="Apellidos"
                  value={registerData.apellidos}
                  onChange={handleChangeRegister}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="Correo Electrónico"
                  value={registerData.email}
                  onChange={handleChangeRegister}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={handleChangeRegister}
                  required
                />
                <input
                  type="text"
                  name="codigoCurso"
                  className="input-field"
                  placeholder="Código de Curso"
                  value={registerData.codigoCurso}
                  onChange={handleChangeRegister}
                  required
                />
                <button type="submit" className="input-submit">
                  <span>Registrarse</span>
                  <img src={flecha} alt="flecha" />
                </button>
              </div>
              {error && <p>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
