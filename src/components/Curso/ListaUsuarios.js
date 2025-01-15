import React, { Component } from 'react'
import foto from '../../assets/images/cover-instalaciones-tajamar-uai-1032x688-nueva.jpg'
import logo from '../../assets/images/logoTajamar.png'
import axios from 'axios'
import Global from "../../utils/Global";
import style from './curso.css'

export class ListaUsuarios extends Component {
  state = {
    usuarios: []
  }

  loadUsuarios = () => {
    var token = Global.token
    let request = "api/usuarios/usuarioscurso/3213"
    let url = Global.urlAlumnos + request
    axios.get(url, {
      headers: {
        'Authorization': token
      }
    }).then(response => {
        this.setState({
            usuarios: response.data
        })
    })
  }

  componentDidMount = () => {
    this.loadUsuarios()
  } 


  render() {
    return (
      <div className='centro-pag'>
        <h1>Desarrollo FullStack 2024/2025</h1>
        <table className='tabla'>
            <thead>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Email</th>
                </tr>
                
            </thead>
            <tbody>
            {
              this.state.usuarios.map((usuario, index) => {
                if (usuario.idRole === 1) { // Verifica si el idRol del usuario es 1
                  return (
                    <tr key={index} className='profesor'>
                      <td><img src={usuario.imagen} className="img-user"/></td>
                      <td>{usuario.usuario}</td>
                      <td>{usuario.email}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={index}>
                      <td><img src={usuario.imagen} className="img-user"/></td>
                      <td>{usuario.usuario}</td>
                      <td>{usuario.email}</td>
                    </tr>
                ); // Retorna null si la condición no se cumple
              })
            }
            </tbody>
        </table>
      </div>
    )
  }
}

export default ListaUsuarios