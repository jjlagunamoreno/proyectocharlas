import React, { Component } from 'react'
import styles from './admin.css'
import Global from '../../utils/Global'
import axios from 'axios'
import AdminService from '../../services/AdminService'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import defaultImage from '../../assets/images/nopfp.png'

export default class Admin extends Component {

    state = {
        cursos: [],
        anios: [],
        anioSeleccionado: '',
        profesores: [],
        alumnos: []
    }

    // Filtrar los cursos según el año seleccionado
    getCursosFiltrados = () => {
      return this.state.anioSeleccionado
        ? this.state.cursos.filter(curso => new Date(curso.fechaInicio).getFullYear() === this.state.anioSeleccionado)
        : this.state.cursos;
    }

     // Función que se llama cuando se cambia el año en el select
    handleAnioChange = (event) => {
      const anioSeleccionado = parseInt(event.target.value, 10);
      this.setState({ anioSeleccionado });
    }

    loadCursos = async () => {
      try {
        const response = await AdminService.GetCursos();

        // Extraemos el año de la fecha de 'fechaInicio' de cada curso
        const anios = [...new Set(response.map(curso => new Date(curso.fechaInicio).getFullYear()))];

        this.setState({
          cursos: response,
          anios: anios
        })
      
        } catch (error) {
          console.error("Error al cargar los usuarios", error);
        }
    }

    


    componentDidMount = () => {
        this.loadCursos();
    }

    mostrarUsuariosCurso = async (idCurso) => {
      try {
  
        const response = await AdminService.GetUsuariosCurso(idCurso);

        const profesores = [];
        const alumnos = [];
        
        for (let i = 0; i < response.length; i++) {
          if(response[i].idRole === 1){
            profesores.push(response[i])
          }else {
            alumnos.push(response[i])
          }
        }
        this.setState({
          profesores: profesores,
          alumnos: alumnos
        })
      } catch (error) {
        console.error("Error al cargar los usuarios", error);
      }
    }
  
  showInfoUser = async (id) => {
    const usuario = this.state.alumnos.find((alumno) => alumno.idUsuario === id)

    // Verificamos si la imagen comienza con "http" o "https"
    let imagenUrl = usuario.imagen;
    if (!imagenUrl.startsWith('http://') && !imagenUrl.startsWith('https://')) {
        // Si no es una URL externa, asignamos una imagen local por defecto
        imagenUrl = defaultImage; // Asegúrate de tener esta imagen local en tu proyecto
    }

    const nombre = `<h3>${usuario.usuario}</h3>`;
    const imagen = `<img class="img-info" src="${imagenUrl}" alt="Imagen de usuario" style="width: 100px; height: 100px;">`;
    const email = `<p>${usuario.email} ${usuario.idUsuario}</p>`;

    const result = await withReactContent(Swal).fire({
      html: `
            <div style="text-align: center;">
                ${imagen}
                ${nombre}
                ${email}
            </div>
      `,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ok",
    });

    // if (result.isConfirmed) {
    //   // Primero actualizamos el estado del usuario
    //   await ApiService.updateEstadoUsuario(idUsuario, estado);

    //   // Luego recargamos los usuarios
    //   await this.loadUsuarios();
    // }
}

  render() {
    return (
      <div className='contenido'>
        <h1>Panel De Control Admin</h1>
        <div className='box-btn-admin'>
            <button type="button" className="button-admin">
                <span className="button__text-admin">Crear Curso</span>
                <span className="button__icon-admin"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg-admin"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
            </button>
        </div>
        <div className='panel-admin'>
          
            <div className='cuadro-cursos'>
              <div>
                <select onChange={this.handleAnioChange} defaultValue="">
                  <option value="">Seleccionar Año</option>
                  {this.state.anios.map((anio, index) => (
                    <option key={index} value={anio}>
                      {anio}
                    </option>
                  ))}
                </select>
              </div>
                {
                  this.getCursosFiltrados().map((curso, index) => {
                    return (
                      <div className='box-curso' onClick={() => {this.mostrarUsuariosCurso(curso.idCurso)}} key={index}>
                        <span><b>{curso.idCurso}</b> {curso.nombre}</span>
                      </div>
                    )
                  })
                }
            </div>
            <div className='separador'></div>
            <div className='cuadro-usuarios'>
                
                <div className='box-users'>
                  <div className='titulo-box'>
                    <span>Profesores:</span>
                  </div>
                  <div className='nombres-users'>
                    {
                      this.state.profesores.map((profe, index) => {
                        return(
                          <div key={index}>
                            <span>{profe.usuario}</span>
                          </div>
                        )
                      })
                    }
                  </div>
                  
                </div>
                <div className='box-users'>
                  <div className='titulo-box'>
                    <span>Alumnos:</span>
                  </div>
                  <div className='nombres-users'>
                      {
                        this.state.alumnos.map((alumno, index) => {
                          return(
                            <div key={index} onClick={() => {this.showInfoUser(alumno.idUsuario)}}>
                              <span>{alumno.usuario}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                </div>
                <div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}
