import React, { Component, useRef } from 'react'
import style from './menu.css'
import logo from '../../assets/images/logoTajamar.png'
import curso from '../../assets/images/educacion.png'
import { NavLink } from 'react-router-dom'
import Global from '../../utils/Global'
import axios from 'axios'

const Menu = () => {

    const barraMenu = useRef(null);
    const txtIcon = useRef(null);
    const icon = useRef(null);

    const ampliarMenu = () => {
        barraMenu.current.style.width = "150px"
        barraMenu.current.style.transition = "1s"

        txtIcon.current.style.transition = "2s"
        txtIcon.current.style.color = "white"
        txtIcon.current.style.right = "30px"

        icon.current.style.backgroundColor = "rgb(24, 59, 105)"
        icon.current.style.transition = "0.5s"
    }

    const cerrarMenu = () => {
        barraMenu.current.style.width = "80px"
        barraMenu.current.style.transition = "1s"
        
        txtIcon.current.style.color = "rgb(35, 82, 144)"
        txtIcon.current.style.transition = "0.5s"

        icon.current.style.backgroundColor = "rgb(35, 82, 144)"
        icon.current.style.transition = "0.5s"
    }

    const generarToken = () => {
        let request = "api/auth/login"
        let url = Global.urlAlumnos + request
        var user = {
            userName: "admin@tajamar365.com",
            password: "12345"
        }
        axios.post(url, user).then(response => {
            localStorage.setItem('token', response.data.response)
        })


        
        
    }

    return (
        <div>
            <div className='menu' onMouseEnter={ampliarMenu} onMouseLeave={cerrarMenu}>
                <div className='barra-iconos' ref={barraMenu}>
                    <div>
                        <NavLink to='/'>
                            <img src={logo} className='logo' />
                        </NavLink>
                    </div>
                    
                    <div className='icon-box' ref={icon}>
                        <NavLink to='curso'>
                            <img src={curso} className='icons' />
                        </NavLink>
                        <h4 className='txt-icon' ref={txtIcon}>Curso</h4>
                    </div>
                    <div className='icon-box' ref={icon}>
                        <button className='boton' onClick={generarToken}>Generear Token</button>
                    </div>
                </div>
                
            </div>
        </div>
    )
  }


export default Menu
