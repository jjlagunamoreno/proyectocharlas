import React, { useRef, useState, useEffect, useContext } from "react";
import "./menu.css";
import logo from "../../assets/images/logoTajamar.png";
import curso from "../../assets/images/educacion.png";
import rondas from "../../assets/images/rondas.png";
import logout from "../../assets/images/logout.png";
import { NavLink, useNavigate } from "react-router-dom";
import Global from '../../utils/Global'
import ApiService from "../../services/ApiService";
import { ProfileImageContext } from '../../context/ProfileImageContext';

const Menu = () => {
  const menu = useRef(null);
  const barraMenu = useRef(null);
  const txtIconCurso = useRef(null);
  const txtIconRondas = useRef(null);
  const iconCurso = useRef(null);
  const iconRondas = useRef(null);
  const [userName, setUserName] = useState('');
  const [userCourse, setUserCourse] = useState('');
  const navigate = useNavigate();
  const txtUserName = useRef(null);
  const txtUserCourse = useRef(null);
  const { profile, setProfile } = useContext(ProfileImageContext);
  const iconLogout = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await ApiService.getUserProfile();
        setUserName(profileData.usuario.nombre);
        setUserCourse(profileData.usuario.curso);
        setProfile(profileData.usuario);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [setProfile]);

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  const logOut = () => {
    Global.token = "";
    window.location.reload(true);
  }
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    if (isOpen) {
      cerrarMenu();
    } else {
      ampliarMenu();
    }
  };

  const ampliarMenu = () => {
    if (menu.current) {
      menu.current.style.width = "200px";
      menu.current.style.transition = "1s";
    }

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
      txtUserName.current.style.transition = "1s";
      txtUserName.current.style.color = "white";
      txtUserName.current.style.left = "80px"
      txtUserName.current.style.opacity = 1;
    }

    if (iconLogout.current){
      iconLogout.current.style.transition = "1s";
      iconLogout.current.style.opacity = "1";
      iconLogout.current.style.left = "90px";
      iconLogout.current.style.top = "20px";
    }

    setIsOpen(true);
  };

  const cerrarMenu = () => {
    if (menu.current) {
      menu.current.style.width = "80px";
      menu.current.style.transition = "1s";
    }

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
      txtUserName.current.style.left = "0px" 
      txtUserName.current.style.opacity = 0;
    }

    if (iconLogout.current){
      iconLogout.current.style.transition = "0.6s";
      iconLogout.current.style.opacity = "0";
      iconLogout.current.style.left = "0px";
      iconLogout.current.style.top = "0px";
    }

    setIsOpen(false);
  };

  return (
    <div>
      <div className={`menu ${isOpen ? "" : "menu-collapsed"}`} ref={menu}>

      <div className={`box-menu ${isOpen ? "change" : ""}`} onClick={toggleMenu}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </div>
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

          
          {profile.imagen && (
            
            <div className="icon-box-profile">
              <NavLink to="/perfil">
              <img
                src={profile.imagen}
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
              </NavLink>
              <div>
                <h4 className="txt-icon-profile" ref={txtUserName} >
                  {userName}
                </h4>
              </div>
              <div>
                <img src={logout}
                 alt="logout" 
                 className="icon-logout"
                 onClick={logOut}
                 ref={iconLogout}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
