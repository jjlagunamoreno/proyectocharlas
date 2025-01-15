import React, { useEffect, useState } from "react";
import axios from "axios";
import Global from "../../utils/Global";
import "./Rondas.css";
import "../../App.css"

const Rondas = () => {
  const [rondas, setRondas] = useState([]);
  const [curso, setCurso] = useState(""); // Nombre del curso
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!Global.token) {
          throw new Error("Token no encontrado. Inicia sesión nuevamente.");
        }

        // Solicitar información del usuario
        const perfilResponse = await axios.get(
          `${Global.urlAlumnos}api/Usuarios/Perfil`,
          {
            headers: {
              Authorization: Global.token,
            },
          }
        );

        const userCurso = perfilResponse.data.usuario.curso; // Nombre del curso
        setCurso(userCurso);

        // Obtener las rondas del curso
        const rondasResponse = await axios.get(
          `${Global.urlAlumnos}api/Rondas/RondasCurso`,
          {
            headers: {
              Authorization: Global.token,
            },
          }
        );

        setRondas(rondasResponse.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        if (err.response?.status === 401) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          window.location.href = "/";
        } else {
          setError("No se pudieron cargar los datos.");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="contenido">
    <div className="rondas-container">
      {curso && <h1 className="text-center">Curso: {curso}</h1>}
      <h2 className="text-center">Rondas del Curso</h2>
      {error && <p className="error">{error}</p>}
      {!error && rondas.length === 0 && (
        <p className="text-center">No hay rondas disponibles.</p>
      )}
      <div className="rondas-list">
        {rondas.map((ronda) => (
          <div key={ronda.idRonda} className="ronda-card card">
            <div className="card-body">
              <h5 className="card-title">Módulo: {ronda.descripcionModulo}</h5>
              <p className="card-text">
                <strong>Fecha de Presentación:</strong>{" "}
                {new Date(ronda.fechaPresentacion).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Fecha de Cierre:</strong>{" "}
                {new Date(ronda.fechaCierre).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Fecha Límite de Votación:</strong>{" "}
                {new Date(ronda.fechaLimiteVotacion).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Duración:</strong> {ronda.duracion} minutos
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Rondas;
