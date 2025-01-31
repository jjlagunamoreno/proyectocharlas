import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Global from "../../utils/Global";
import { useNavigate } from "react-router-dom";
import "./Rondas.css";

const Rondas = () => {
  const [rondas, setRondas] = useState([]);
  const [curso, setCurso] = useState("");
  const [error, setError] = useState(null);
  const [esProfesor, setEsProfesor] = useState(false); // Estado para verificar si es profesor
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!Global.token) {
          throw new Error("Token no encontrado. Inicia sesión nuevamente.");
        }

        // Obtener perfil del usuario
        const perfilResponse = await axios.get(
          `${Global.urlAlumnos}api/Usuarios/Perfil`,
          { headers: { Authorization: Global.token } }
        );
        setCurso(perfilResponse.data.usuario.curso);

        // Verificar si el usuario es profesor
        if (perfilResponse.data.usuario.idRole === 1) {
          setEsProfesor(true);
        }

        // Obtener rondas del curso
        const rondasResponse = await axios.get(
          `${Global.urlAlumnos}api/Rondas/RondasCurso`,
          { headers: { Authorization: Global.token } }
        );
        setRondas(rondasResponse.data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudieron cargar las rondas.");
      }
    };

    fetchData();
  }, []);

  const getEvents = () => {
    return rondas.map((ronda) => {
      const startDate = new Date(ronda.fechaPresentacion);
      const now = new Date();

      let circleColor = "green";
      if (startDate < now) {
        circleColor = "red";
      } else if (startDate.toDateString() === now.toDateString()) {
        circleColor = "orange";
      }

      return {
        title: "",
        start: ronda.fechaPresentacion,
        extendedProps: {
          idRonda: ronda.idRonda,
          modulo: ronda.descripcionModulo,
          circleColor,
        },
      };
    });
  };

  const handleEventClick = (info) => {
    const idRonda = info.event.extendedProps.idRonda;
    if (idRonda) {
      navigate(`/charlas/${idRonda}`);
    }
  };

  return (
    <div className="rondas-container">
      {curso && (
        <h1 className="calendario-titulo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-calendar"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>{" "} {curso}
        </h1>
      )}

      {error && <p className="error">{error}</p>}

      {/* Mostrar botón solo si el usuario es profesor */}
      {esProfesor && (
        <button className="btn btn-primary" style={{
          backgroundColor: "#007bff",
          color: "white",
          borderColor: "#007bff",
          padding: "10px 15px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background-color 0.3s ease",
        }} onClick={() => navigate("/CrearRonda")}>
          + Nueva Ronda
        </button>
      )}

      {!error && (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          firstDay={1}
          events={getEvents()}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          buttonText={{
            today: "Hoy",
          }}
          height="auto"
          contentHeight="auto"
          dayMaxEventRows={3}
          customButtons={{
            title: {
              text: "enero de 2025",
              click: () => { },
            },
          }}
          eventContent={(eventInfo) => {
            const { modulo, circleColor } = eventInfo.event.extendedProps;
            return (
              <div className="event-indicator-wrapper">
                <div
                  className="event-indicator"
                  style={{ backgroundColor: circleColor }}
                />
                <span className="event-module">{modulo}</span>
              </div>
            );
          }}
        />

      )}
    </div>
  );
};

export default Rondas;
