import React, { Component } from 'react'
import styles from './admin.css'
import Global from '../../utils/Global'
import axios from 'axios'
import AdminService from '../../services/AdminService'

export default class Admin extends Component {

    state = {
        cursos: [],
        anios: []
    }

    loadCursos = async () => {
        try {
           const response = await AdminService.GetCursos();
      
            console.log(response);
            this.setState = {
                cursos: response
            }
      
          } catch (error) {
            console.error("Error al cargar los usuarios", error);
          }
    }


    componentDidMount = () => {
        this.loadCursos();
    }

  render() {
    return (
      <div className='contenido'>
        <h1>Panel De Control Admin</h1>
        <div className='box-btn-admin'>
            <button type="button" class="button-admin">
                <span class="button__text-admin">Crear Curso</span>
                <span class="button__icon-admin"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg-admin"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
            </button>
        </div>
        <div className='panel-admin'>
            <div className='cuadro-cursos'>
                <span>Curso 1</span>
            </div>
            <div className='separador'></div>
            <div className='cuadro-usuarios'>
                <span>Profesores:</span>
                <span>Alumnos:</span>
            </div>
        </div>
      </div>
    )
  }
}
