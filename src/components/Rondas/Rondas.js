import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();

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

      let circleColor = "green"; // Por defecto, futuro
      if (startDate < now) {
        circleColor = "red"; // Pasado
      } else if (startDate.toDateString() === now.toDateString()) {
        circleColor = "orange"; // Hoy
      }

      return {
        title: "",
        start: ronda.fechaPresentacion,
        extendedProps: {
          idRonda: ronda.idRonda,
          hora: startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    <div className="rondas-container">
      {curso && <h1 className="calendario-titulo">CALENDARIO - {curso}</h1>}
      {error && <p className="error">{error}</p>}
      {!error && (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          firstDay={1} /* Comienza el lunes */
          events={getEvents()}
          eventContent={(eventInfo) => {
            const { modulo, circleColor } = eventInfo.event.extendedProps;
            return (
              <div className="event-indicator" style={{ backgroundColor: circleColor }}>
                <span className="event-tooltip">{modulo}</span>
              </div>
            );
          }}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          height="auto"
          contentHeight="auto"
          dayMaxEventRows={3}
        />
      )}
    </div>
  );
};

export default Rondas;
