import React, { useRef } from "react";
import style from "./menu.css";
import logo from "../../assets/images/logoTajamar.png";
import curso from "../../assets/images/educacion.png";
import rondas from "../../assets/images/rondas.png";
import { NavLink } from "react-router-dom";

const Menu = () => {
  const barraMenu = useRef(null);
  const txtIconCurso = useRef(null);
  const txtIconRondas = useRef(null);
  const iconCurso = useRef(null);
  const iconRondas = useRef(null);

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
        </div>
      </div>
    </div>
  );
};

export default Menu;
