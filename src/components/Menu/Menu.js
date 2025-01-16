import React, { useRef } from "react";
import "./menu.css";
import logo from "../../assets/images/logoTajamar.png";
import curso from "../../assets/images/educacion.png";
import rondas from "../../assets/images/rondas.png";
import { NavLink } from "react-router-dom";
import Global from '../../utils/Global'

const Menu = () => {
  const barraMenu = useRef(null);
  const txtIconCurso = useRef(null);
  const txtIconRondas = useRef(null);
  const iconCurso = useRef(null);
  const iconRondas = useRef(null);

  const ampliarMenu = () => {
    console.log(txtIconCurso);
    console.log(txtIconRondas);

    barraMenu.current.style.width = "150px";
    barraMenu.current.style.transition = "1s";

    if(txtIconCurso.current != null){
      txtIconCurso.current.style.transition = "2s";
      txtIconCurso.current.style.color = "white";
      txtIconCurso.current.style.right = "30px";
    }

    txtIconRondas.current.style.transition = "2s";
    txtIconRondas.current.style.color = "white";
    txtIconRondas.current.style.right = "30px";
  };

  const cerrarMenu = () => {
    barraMenu.current.style.width = "80px";
    barraMenu.current.style.transition = "1s";

    if(txtIconCurso.current != null){
      txtIconCurso.current.style.color = "rgb(35, 82, 144)";
      txtIconCurso.current.style.transition = "0.5s";
    }
    txtIconRondas.current.style.color = "rgb(35, 82, 144)";
    txtIconRondas.current.style.transition = "0.5s";
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
        </div>
      </div>
    </div>
  );
};

export default Menu;
