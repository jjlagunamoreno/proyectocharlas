import React, { Component } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Global from "../../utils/Global";
import './curso.css'
import '../../App.css'
import ApiService from '../../services/ApiService';
import defaultImage from "../../assets/images/nopfp.png";
import advertencia from "../../assets/images/senal-de-advertencia.png"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class ListaUsuarios extends Component {
  
  state = {
    usuarios: [], // Contendrá todos los usuarios, tanto activos como inactivos.
    usuariosFiltrados: [],
    nombreCurso: '',  
    UserIds: [],
    estadoActual: true,
    searchQuery: '', // Texto de búsqueda
  };

  // Función para cargar los usuarios desde la API
  loadUsuarios = async (estado) => {
    try {
      var token = Global.token;
      let request = "api/Profesor/AlumnosCursoActivoProfesor";
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
      const nombreCurso = response.data[0].curso.nombre;

      this.setState({
        usuarios, // Guardamos todos los usuarios en el estado
        usuariosFiltrados,
        nombreCurso
      });

    } catch (error) {
      console.error("Error al cargar los usuarios", error);
    }
  };

  // Función para cambiar los usuarios filtrados por estado
  changeUsers = (estado) => {
    const { usuarios } = this.state;
    this.state.UserIds = [];
    const usuariosFiltrados = usuarios.filter(usuario => 
      usuario.alumno.estadoUsuario === estado // Filtrar según el valor booleano
    );
    this.setState({
      usuariosFiltrados: usuariosFiltrados, // Actualizamos el estado con los usuarios filtrados
      estadoActual: estado
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
      this.loadUsuarios(estado);
    }
  };

  showSwalSelectedStates = async () => {
    const result = await withReactContent(Swal).fire({
      title: "Cambiar el estado de los usuarios seleccionados",
      text: "¿Estas seguro de cambiar el estado de los usuarios seleccionados?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No"
    });
    
    if (result.isConfirmed) {
      // Primero actualizamos el estado del usuario
      var estado = this.state.estadoActual;
      estado = !estado;
      console.log(estado)
      const {UserIds} = this.state;
      await ApiService.updateEstadoUsuariosSeleccionados(UserIds, estado);

      // Luego recargamos los usuarios
      await this.loadUsuarios();

      Swal.fire({
        title: "Actualizado!",
        text: "El estado ha sido actualizado.",
        icon: "success"
      });
      this.loadUsuarios(estado);
    }
  };

  showWarning = async () => {
    Swal.fire({
      title: "¡Atención!",
      text: "Para cambiar el estado de un alumno haz click en el botón situado a la derecha de un alumno o selecciona los alumnos y haz en 'Cambiar Estados Seleccionados'",
      icon: "info"
    });
  }

  verificarImagen = (url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    return defaultImage; // Reemplaza con la ruta de tu imagen por defecto
  };

  guardarId = (id) => {
    // Obtener el array actual de ids del estado
    const { UserIds } = this.state;
    // Si el checkbox está marcado, agregamos el ID
    if (UserIds.includes(id)) {
      // Si el ID ya está en el array, lo eliminamos
      this.setState(prevState => ({
        UserIds: prevState.UserIds.filter(userId => userId !== id)
      }));
    } else {
      // Si el ID no está en el array, lo agregamos
      this.setState(prevState => ({
        UserIds: [...prevState.UserIds, id]
      }));
    }
  };

  handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();  // Obtener el texto en minúsculas
    this.setState({ searchQuery: query }, () => {
      this.filterUsers(query);  // Llamamos a la función para filtrar usuarios
    });
  };
  
  filterUsers = (query) => {
    const { usuarios } = this.state;
    
    if (!query) {
      // Si no hay texto en el input, mostramos todos los usuarios
      this.setState({ usuariosFiltrados: usuarios });
    } else {
      // Filtrar usuarios por nombre
      const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.alumno.usuario.toLowerCase().includes(query)  // Compara el nombre del alumno con la búsqueda
      );
      this.setState({ usuariosFiltrados });
    }
  };

  render() {
    return (
      <div className='contenido'>
        <h1>{this.state.nombreCurso}</h1>
        <div className='filters-box'>
          <div className='filter' onClick={() => this.changeUsers(true)}>
            <h4>Activos</h4>
          </div>
          <div className='filter' onClick={() => this.changeUsers(false)}>
            <h4>Inactivos</h4>
          </div>
          <div className='filter-warning' onClick={() => this.showWarning()}>
            <img src={advertencia} alt='Advertencia'/>
          </div>
        </div>
        <div className="table__body">
          <table>
            <thead>
              <tr>
                <th><button className='btnChangeState' onClick={() => {this.showSwalSelectedStates()}}>Cambiar Estados Seleccionados</button></th>
                <th>  
                  <div class="form">
                    <button>
                        <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                            <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <input class="input" required="" type="text" placeholder="Filtrar por nombre..."
                    onChange={this.handleSearchChange}  // Filtrar al escribir
                    value={this.state.searchQuery} // Sincronizado con el estado/
                    /> 
                  </div> 
                </th>
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
                      <td>
                        <input
                        type="checkbox"
                        checked={this.state.UserIds.includes(usuario.alumno.idUsuario)} // Verifica si el id está en el array
                        onChange={() => this.guardarId(usuario.alumno.idUsuario)} // Llama a la función cuando cambia el estado
                        />
                      </td>
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