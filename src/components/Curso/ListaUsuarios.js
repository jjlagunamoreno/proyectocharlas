import React, { Component } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Global from "../../utils/Global";
import './curso.css'
import '../../App.css'
import ApiService from '../../services/ApiService';
import defaultImage from "../../assets/images/nopfp.png";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class ListaUsuarios extends Component {
  
  state = {
    usuarios: [], // Contendrá todos los usuarios, tanto activos como inactivos.
    usuariosFiltrados: []
  };

  // Función para cargar los usuarios desde la API
  loadUsuarios = async (estado) => {
    try {
      var token = Global.token;
      let request = "api/Profesor/AlumnosCursoProfesor";
      let url = Global.urlAlumnos + request;

      const response = await axios.get(url, {
        headers: {
          'Authorization': token,
        },
      });

      // Filtrar los usuarios activos e inactivos
      const usuarios = response.data[0].alumnos;
      const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.alumno.estadoUsuario === estado // Filtrar según el valor booleano
      );

      this.setState({
        usuarios, // Guardamos todos los usuarios en el estado
        usuariosFiltrados
      });

    } catch (error) {
      console.error("Error al cargar los usuarios", error);
    }
  };

  // Función para cambiar los usuarios filtrados por estado
  changeUsers = (estado) => {
    const { usuarios } = this.state;
    const usuariosFiltrados = usuarios.filter(usuario => 
      usuario.alumno.estadoUsuario === estado // Filtrar según el valor booleano
    );
    this.setState({
      usuariosFiltrados: usuariosFiltrados, // Actualizamos el estado con los usuarios filtrados
    });
  };

  // Se llama cuando el componente se monta
  componentDidMount = () => {
    this.loadUsuarios(true);
  }

  // Función que muestra el Swal y maneja la lógica
  showSwal = async (idUsuario, estado) => {
    const result = await withReactContent(Swal).fire({
      title: "Cambiar el estado del usuario",
      text: "¿Estas seguro de cambiar el estado del usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No"
    });

    if (result.isConfirmed) {
      // Primero actualizamos el estado del usuario
      await ApiService.updateEstadoUsuario(idUsuario, estado);

      // Luego recargamos los usuarios
      await this.loadUsuarios();

      Swal.fire({
        title: "Actualizado!",
        text: "El estado ha sido actualizado.",
        icon: "success"
      });
    }
  };

  verificarImagen = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    return defaultImage; // Reemplaza con la ruta de tu imagen por defecto
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
                      <td><img src={this.verificarImagen(usuario.alumno.imagen)} alt='Error en la Imagen'></img></td>
                      <td>{usuario.alumno.usuario}</td>
                      <td>{usuario.alumno.email}</td>
                      {
                        usuario.alumno.estadoUsuario === true ? (
                          <td >
                            <p className="status active" onClick={() => this.showSwal(usuario.alumno.idUsuario, false)}>Activo</p>
                          </td>
                        ) : (
                          <td>
                            <p className="status inactive" onClick={() => this.showSwal(usuario.alumno.idUsuario, true)}>Inactivo</p>
                          </td>
                        )
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}