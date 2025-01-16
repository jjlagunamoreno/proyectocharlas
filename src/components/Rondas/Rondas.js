import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import Global from "../../utils/Global";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "./Rondas.css";
import "../../App.css"

const Rondas = () => {
  const [rondas, setRondas] = useState([]); // Listado de rondas
  const [curso, setCurso] = useState(""); // Nombre del curso
  const [error, setError] = useState(null); // Gestión de errores
  const navigate = useNavigate(); // Redirección

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!Global.token) {
          throw new Error("Token no encontrado. Inicia sesión nuevamente.");
        }

        // Solicitar información del perfil del usuario
        const perfilResponse = await axios.get(
          `${Global.urlAlumnos}api/Usuarios/Perfil`,
          {
            headers: { Authorization: Global.token },
          }
        );
        setCurso(perfilResponse.data.usuario.curso);

        // Obtener rondas del curso
        const rondasResponse = await axios.get(
          `${Global.urlAlumnos}api/Rondas/RondasCurso`,
          {
            headers: { Authorization: Global.token },
          }
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

      let circleColor = "green"; // Por defecto, futuro
      if (startDate < now) {
        circleColor = "red"; // Pasado
      } else if (
        startDate.toDateString() === now.toDateString() &&
        startDate > now
      ) {
        circleColor = "orange"; // Hoy
      }

      return {
        title: "",
        start: ronda.fechaPresentacion,
        extendedProps: {
          idRonda: ronda.idRonda,
          hora: startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          modulo: ronda.descripcionModulo,
          duracion: ronda.duracion,
          circleColor,
        },
        allDay: false,
        backgroundColor: "transparent",
        textColor: "black",
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
    <div className="contenido">
    <div className="rondas-container">
      {curso && <h1 className="text-center">CALENDARIO - {curso}</h1>}
      {error && <p className="error">{error}</p>}
      {!error && (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          events={getEvents()}
          eventContent={(eventInfo) => {
            const { hora, modulo, duracion, circleColor } =
              eventInfo.event.extendedProps;

            return (
              <StyledRonda circleColor={circleColor}>
                <div className="circle" />
                <div className="event-content">
                  <div className="modulo">{modulo}</div>
                  <div className="hora-duracion">
                    <span className="hora">{hora}</span>{" "}
                    <span className="duracion">{`(${duracion} min)`}</span>
                  </div>
                </div>
              </StyledRonda>
            );
          }}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          height="600px" /* Reducir altura */
          contentHeight="500px"
          dayMaxEventRows={3} /* Limitar eventos visibles */
          dayCellClassNames={(date) =>
            new Date(date.date) < new Date() ? "past-day" : ""
          }
        />
      )}
    </div>
    </div>
  );
};

export default Rondas;

const StyledRonda = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: Arial, sans-serif;
  font-size: 0.85rem; /* Reducir tamaño general */
  .circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => props.circleColor};
  }
  .event-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .modulo {
    font-size: 1rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 3px;
  }
  .hora-duracion {
    display: flex;
    gap: 5px;
    font-size: 0.75rem;
    color: #666;
  }
  .hora {
    font-weight: bold;
  }
`;
