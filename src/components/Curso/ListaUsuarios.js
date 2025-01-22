import React, { Component } from 'react'
import axios from 'axios'
import Global from "../../utils/Global";
import './curso.css'
import '../../App.css'
import defaultImage from "../../assets/images/nopfp.png";

export default class ListaUsuarios extends Component {
  state = {
    usuarios: [], // Contendrá todos los usuarios, tanto activos como inactivos.
    usuariosFiltrados: []
  };

  // Función para cargar los usuarios desde la API
  loadUsuarios = () => {
    var token = Global.token;
    let request = "api/Profesor/AlumnosCursoProfesor";
    let url = Global.urlAlumnos + request;

    axios.get(url, {
      headers: {
        'Authorization': token,
      },
    }).then(response => {
      // Filtrar los usuarios activos e inactivos
      const usuarios = response.data[0].alumnos;
      this.setState({
        usuarios, // Guardamos todos los usuarios en el estado
      });
    }).catch(error => {
      console.error("Error al cargar los usuarios", error);
    });
  };

  changeUsers = (estado) => {
    console.log(estado);
    
    const { usuarios } = this.state;
    const usuariosFiltrados = usuarios.filter(usuario => 
      usuario.alumno.estadoUsuario === estado // Filtrar según el valor booleano
    );
    this.setState({
      usuariosFiltrados: usuariosFiltrados, // Actualizamos el estado con los usuarios filtrados
    });
  };

  componentDidMount = () => {
    this.loadUsuarios()
  } 

  isValidImage = (url) => {
    if (!url) return false; // Si no hay URL, no es válida.
    const image = new Image();
    image.src = url;
 
    // Validar si la URL es válida comprobando el formato MIME y errores de carga
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
    return isImage;
  };


  render() {
    return (
      <div className='contenido'>
        <h1>Desarrollo FullStack 2024/2025</h1>
        <div className='filters-box'>
          <div className='filter' onClick={() => this.changeUsers(true)}>
            <h4>Activos</h4>
          </div>
          <div className='filter' onClick={() => this.changeUsers(false)}>
            <h4>Inactivos</h4>
          </div>
        </div>
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
              this.state.usuariosFiltrados.map((usuario, index) => {
                
                return(
                  <tr key={index}>
                    <td><img src={this.isValidImage(usuario.alumno.imagen) ? usuario.alumno.imagen : defaultImage} alt='Error en la Imagen'></img></td>
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
      </div>
      </div>
  )
}
}