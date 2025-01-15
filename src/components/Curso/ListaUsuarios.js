import React, { Component } from 'react'
import foto from '../../assets/images/cover-instalaciones-tajamar-uai-1032x688-nueva.jpg'
import logo from '../../assets/images/logoTajamar.png'
import axios from 'axios'
import Global from "../../utils/Global";
import './curso.css'
import '../../App.css'

export default class ListaUsuarios extends Component {
  state = {
    usuarios: []
  }

  loadUsuarios = () => {
    var token = Global.token
    let request = "api/Profesor/AlumnosCursoProfesor"
    let url = Global.urlAlumnos + request
    axios.get(url, {
      headers: {
        'Authorization': token
      }
    }).then(response => {
        this.setState({
            usuarios: response.data[0].alumnos
        })
    })
  }

  componentDidMount = () => {
    this.loadUsuarios()
  } 


  render() {
    return (
      <div className='contenido'>
        <h1>Desarrollo FullStack 2024/2025</h1>
        <div className="table__body">
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>Alumno</th>
              <th>Correo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.usuarios.map((usuario, index) => {
                return(
                  <tr>
                    <td><img src={usuario.alumno.imagen}></img></td>
                    <td>{usuario.alumno.usuario}</td>
                    <td>{usuario.alumno.email}</td>
                    {
                      usuario.alumno.estadoUsuario === true ? (
                        <td>
                        <p class="status active">Activo</p>
                        </td>
                      ) : (
                        <td>
                        <p class="status inactive">Inactivo</p>
                        </td>
                      )
                    }
                  </tr>
                )
              })
            }
            
          </tbody>
        </table>
        {/* <table className='tabla'>
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
                return (
                  <tr key={index}>
                      <td><img src={usuario.alumno.imagen} className="img-user"/></td>
                      <td>{usuario.alumno.usuario}</td>
                      <td>{usuario.alumno.email}</td>
                    </tr>
                ); // Retorna null si la condición no se cumple
              })
            }
            </tbody>
        </table>
      </div> */}
      </div>
      </div>
  )
}
}