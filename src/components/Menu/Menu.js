import React, { useRef, useEffect, useState } from "react";
import style from "./menu.css";
import logo from "../../assets/images/logoTajamar.png";
import curso from "../../assets/images/educacion.png";
import rondas from "../../assets/images/rondas.png";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

const Menu = () => {
  const barraMenu = useRef(null);
  const txtIconCurso = useRef(null);
  const txtIconRondas = useRef(null);
  const iconCurso = useRef(null);
  const iconRondas = useRef(null);
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [userCourse, setUserCourse] = useState('');
  const navigate = useNavigate();
  const txtUserName = useRef(null);
  const txtUserCourse = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await ApiService.getUserProfile();
        setUserImage(profileData.usuario.imagen);
        setUserName(profileData.usuario.nombre);
        setUserCourse(profileData.usuario.curso);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const ampliarMenu = () => {
    barraMenu.current.style.width = "150px";
    barraMenu.current.style.transition = "1s";

    txtIconCurso.current.style.transition = "2s";
    txtIconCurso.current.style.color = "white";
    txtIconCurso.current.style.right = "30px";

    txtIconRondas.current.style.transition = "2s";
    txtIconRondas.current.style.color = "white";
    txtIconRondas.current.style.right = "30px";

    iconCurso.current.style.backgroundColor = "rgb(24, 59, 105)";
    iconCurso.current.style.transition = "0.5s";

    iconRondas.current.style.backgroundColor = "rgb(24, 59, 105)";
    iconRondas.current.style.transition = "0.5s";

    if (txtUserName.current) {
      txtUserName.current.style.transition = "2s";
      txtUserName.current.style.color = "white";
      txtUserName.current.style.right = "30px";
      txtUserName.current.style.opacity = 1;
    }

    if (txtUserCourse.current) {
      txtUserCourse.current.style.transition = "2s";
      txtUserCourse.current.style.color = "white";
      txtUserCourse.current.style.right = "30px";
      txtUserCourse.current.style.opacity = 1;
    }
  };

  const cerrarMenu = () => {
    barraMenu.current.style.width = "80px";
    barraMenu.current.style.transition = "1s";

    txtIconCurso.current.style.color = "rgb(35, 82, 144)";
    txtIconCurso.current.style.transition = "0.5s";

    txtIconRondas.current.style.color = "rgb(35, 82, 144)";
    txtIconRondas.current.style.transition = "0.5s";

    iconCurso.current.style.backgroundColor = "rgb(35, 82, 144)";
    iconCurso.current.style.transition = "0.5s";

    iconRondas.current.style.backgroundColor = "rgb(35, 82, 144)";
    iconRondas.current.style.transition = "0.5s";

    if (txtUserName.current) {
      txtUserName.current.style.color = "rgb(35, 82, 144)";
      txtUserName.current.style.transition = "0.5s";
      txtUserName.current.style.opacity = 0;
    }

    if (txtUserCourse.current) {
      txtUserCourse.current.style.color = "rgb(35, 82, 144)";
      txtUserCourse.current.style.transition = "0.5s";
      txtUserCourse.current.style.opacity = 0;
    }
  };

  return (
    <div>
      <div className="menu" onMouseEnter={ampliarMenu} onMouseLeave={cerrarMenu}>
        <div className="barra-iconos" ref={barraMenu}>
          {/* Logo */}
          <div>
            <NavLink to="/">
              <img src={logo} className="logo" alt="Logo" />
            </NavLink>
          </div>

          {/* Icono de Curso */}
          <div className="icon-box" ref={iconCurso}>
            <NavLink to="/curso">
              <img src={curso} className="icons" alt="Curso" />
            </NavLink>
            <h4 className="txt-icon" ref={txtIconCurso}>
              Curso
            </h4>
          </div>

          {/* Icono de Rondas */}
          <div className="icon-box" ref={iconRondas}>
            <NavLink to="/rondas">
              <img src={rondas} className="icons" alt="Rondas" />
            </NavLink>
            <h4 className="txt-icon" ref={txtIconRondas}>
              Rondas
            </h4>
          </div>

          {/* Imagen de Perfil */}
          {userImage && (
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'center' }}>
              <img
                src={userImage}
                alt="User Profile"
                className="user-profile-image"
                onClick={handleProfileClick}
                style={{
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%'
                }}
              />
              <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h4 className="txt-icon" ref={txtUserName} style={{ margin: 0, transition: '2s', color: 'rgb(35, 82, 144)', opacity: 0 }}>
                  {userName}
                </h4>
                <p className="txt-icon" ref={txtUserCourse} style={{ margin: 0, fontSize: '12px', transition: '2s', color: 'rgb(35, 82, 144)', opacity: 0 }}>
                  {userCourse}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
