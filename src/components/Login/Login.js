import React, { useRef, useState } from "react";
import style from "./login.css";
import logo from "../../assets/images/logoTajamar.png";
import flecha from '../../assets/images/right-arrow-alt-regular-24.png';
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await ApiService.login(credentials);
      if (token) {
        const bearerToken = `Bearer ${token}`;
        localStorage.setItem('token', bearerToken);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  const loginFormRef = useRef(null);
  const registerFormRef = useRef(null);
  const col1Ref = useRef(null);
  const loginBtnRef = useRef(null);
  const registerBtnRef = useRef(null);

  const handleLoginClick = () => {
    loginBtnRef.current.style.backgroundColor = "#21264D";
    registerBtnRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    loginFormRef.current.style.left = "50%";
    registerFormRef.current.style.left = "-50%";
    loginFormRef.current.style.opacity = 1;
    registerFormRef.current.style.opacity = 0;
    col1Ref.current.style.borderRadius = "20px 30% 20% 20px";
  };

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
        <div className="col col-1" ref={col1Ref}>
          <div className="image-layer">
            <img src={logo} className="form-image-main" alt="Logo Tajamar" />
          </div>
          <p className="featured-words">
            Login de Gestión de charlas. <span>Tajamar</span>
          </p>
        </div>

        <div className="col col-2">
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

          <div className="login-form" ref={loginFormRef}>
            <div className="form-title">
              <span>Inicio de sesión</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-input">
                <div className="input-box">
                  <input
                    type="text"
                    name="userName"
                    className="input-field"
                    placeholder="Username"
                    required
                    value={credentials.userName}
                    onChange={handleChange}
                  />
                  <i className="bx bx-user icon"></i>
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    name="password"
                    className="input-field"
                    placeholder="Password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                  />
                  <i className="bx bx-lock-alt icon"></i>
                </div>
                <div className="input-box">
                  <button type="submit" className="input-submit">
                    <span>Iniciar sesión</span>
                    <img src={flecha} alt="flecha" />
                  </button>
                </div>
              </div>
              {error && <p className="error">{error}</p>}
            </form>
          </div>

          <div className="register-form" ref={registerFormRef}>
            <div className="form-title">
              <span>Crear una cuenta</span>
            </div>
            <div className="form-input">
              <div className="input-box">
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email"
                  required
                />
                <i className="bx bx-envelope icon"></i>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Código Curso"
                  required
                />
                <i className="bx bxs-school icon"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  className="input-field"
                  placeholder="Password"
                  required
                />
                <i className="bx bx-lock-alt icon"></i>
              </div>
              <div className="input-box">
                <button className="input-submit">
                  <span>Registrarse</span>
                  <img src={flecha} alt="flecha" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
