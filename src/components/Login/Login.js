import React, { useRef, useState, useContext } from "react";
import "./login.css";
import logo from "../../assets/images/logoTajamar.png";
import flecha from "../../assets/images/right-arrow-alt-regular-24.png";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import Global from "../../utils/Global";
import { PasswordContext } from '../../context/PasswordContext';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

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

  const { setCurrentPassword } = useContext(PasswordContext);
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
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    try {
      const { token, role, estadoUsuario } = await ApiService.login(credentials);

      if (!estadoUsuario) {
        setError("Tu cuenta está inactiva. No puedes acceder a la plataforma.");
        return;
      }

      if (token) {
        // Guardar el token en Global
        Global.token = `Bearer ${token}`;
        Global.role = role;
        setIsAuthenticated(true); // Actualizar el estado de autenticación
        setCurrentPassword(credentials.password); // Guardar la contraseña en contexto (si aplica)

        navigate("/"); // Redirigir al Home
      }
    } catch (err) {
      setError(err.message || "Credenciales incorrectas"); // Mensaje de error en caso de falla
    }
  };

  // FUNCIÓN PARA ENVIAR LOS DATOS DE REGISTRO A LA API
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      // DETERMINAR EL ROL SEGÚN SI SE INGRESÓ CÓDIGO DE PROFESOR
      const idRole = codigoProfesor.trim() === "yosoytuprofe" ? 1 : 2;

      // ESTRUCTURA DEL CUERPO DE LA SOLICITUD
      const requestBody = {
        idUsuario: 0,
        nombre: registerData.nombre,
        apellidos: registerData.apellidos,
        email: registerData.email,
        estadoUsuario: true,
        imagen: "imagen.png",
        password: registerData.password,
        idRole: idRole, // SE ASIGNA EL ROL SEGÚN EL CÓDIGO INGRESADO
      };

      console.log(`📡 Registrando como ${idRole === 1 ? "profesor" : "alumno"}...`);

      if (idRole === 2) {
        // SI ES ALUMNO, VALIDAR QUE EL CÓDIGO DE CURSO SEA VÁLIDO
        if (!registerData.codigoCurso || isNaN(registerData.codigoCurso)) {
          Swal.fire("❌ Error", "Debes proporcionar un código de curso válido.", "error");
          return;
        }

        await ApiService.registerAlumno(registerData.codigoCurso, requestBody);
        Swal.fire("✅ Registro exitoso", "Te has registrado como alumno.", "success");
      } else {
        const profesorResponse = await ApiService.registerProfesor(requestBody);
        const { idUsuario } = profesorResponse;

        // Iniciar sesión como profesor
        const loginResponse = await ApiService.login({
          userName: registerData.email,
          password: registerData.password,
        });

        if (loginResponse.token) {
          // Asignar el curso al profesor
          await ApiService.asignarCursoProfesor(idUsuario, registerData.codigoCurso);
          Swal.fire("✅ Registro exitoso", "Te has registrado como profesor y se te ha asignado el curso.", "success");
        }
      }

      navigate("/"); // REDIRIGIR AL LOGIN TRAS REGISTRO EXITOSO
    } catch (err) {
      console.error("🔥 Error en el registro:", err);
      Swal.fire("❌ Error en el registro", "No se pudo completar el proceso.", "error");
    }
  };

  const [codigoProfesor, setCodigoProfesor] = useState("");

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

  const codigoProfesorPopUp = async () => {
    const result = await Swal.fire({
      title: "Introduce el código de profesor",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "Verificar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed && result.value.trim() !== "") {
      setCodigoProfesor(result.value.trim()); // Guarda el código ingresado en el estado
      console.log("✅ Código de profesor guardado:", result.value.trim());
    } else {
      setCodigoProfesor(""); // Asegurar que si se cancela, no tenga valor residual
    }
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
              <div className="box-btn-profesor">
                <button onClick={() => { codigoProfesorPopUp() }}>
                  <span className="shadow"></span>
                  <span className="edge"></span>
                  <span className="front text"> ¿Eres profesor?
                  </span>
                </button>
              </div>
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
