import React, { useRef, useState, useEffect } from "react";
import "./menu.css";
import logo from "../../assets/images/logoTajamar.png";
import curso from "../../assets/images/educacion.png";
import rondas from "../../assets/images/rondas.png";
import { NavLink, useNavigate } from "react-router-dom";
import Global from '../../utils/Global'
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
    if (barraMenu.current) {
      barraMenu.current.style.width = "150px";
      barraMenu.current.style.transition = "1s";
    }

    if (txtIconCurso.current) {
      txtIconCurso.current.style.transition = "2s";
      txtIconCurso.current.style.color = "white";
      txtIconCurso.current.style.right = "30px";
    }

    if (txtIconRondas.current) {
      txtIconRondas.current.style.transition = "2s";
      txtIconRondas.current.style.color = "white";
      txtIconRondas.current.style.right = "30px";
    }

    if (txtUserName.current) {
      txtUserName.current.style.transition = "2s";
      txtUserName.current.style.color = "white";
      txtUserName.current.style.opacity = 1;
    }

    if (txtUserCourse.current) {
      txtUserCourse.current.style.transition = "2s";
      txtUserCourse.current.style.color = "white";
      txtUserCourse.current.style.opacity = 1;
    }
  };

  const cerrarMenu = () => {
    if (barraMenu.current) {
      barraMenu.current.style.width = "80px";
      barraMenu.current.style.transition = "1s";
    }

    if (txtIconCurso.current) {
      txtIconCurso.current.style.color = "#21264d";
      txtIconCurso.current.style.transition = "0.5s";
    }

    if (txtIconRondas.current) {
      txtIconRondas.current.style.color = "#21264d";
      txtIconRondas.current.style.transition = "0.5s";
    }

    if (txtUserName.current) {
      txtUserName.current.style.color = "#21264d";
      txtUserName.current.style.transition = "0.5s";
      txtUserName.current.style.opacity = 0;
    }

    if (txtUserCourse.current) {
      txtUserCourse.current.style.color = "#21264d";
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
          {
            Global.role !== 2 && (
            <NavLink to="/curso">
                <div className="icon-box" ref={iconCurso}>
                  
                    <img src={curso} className="icons" alt="Curso" />
                  
                    <h4 className="txt-icon" ref={txtIconCurso}>
                      Curso
                    </h4>
                </div>
            </NavLink>
            )
          }
          
          {/* Icono de Rondas */}
          <NavLink to="/rondas">
            <div className="icon-box" ref={iconRondas}>
              
                <img src={rondas} className="icons" alt="Rondas" />
              
                <h4 className="txt-icon" ref={txtIconRondas}>
                  Rondas
                </h4>
            </div>
          </NavLink>

          {/* Imagen de Perfil */}
          {userImage && (
            <div className="icon-box-profile">
              <img
                src={userImage}
                alt="User Profile"
                className="user-profile-image"
                onClick={handleProfileClick}
              />
              <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h4 className="txt-icon-profile" ref={txtUserName} >
                  {userName}
                </h4>
                <p className="txt-icon-profile" ref={txtUserCourse} style={{ margin: 0, fontSize: '12px', transition: '2s', color: 'rgb(35, 82, 144)', opacity: 0 }}>
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
