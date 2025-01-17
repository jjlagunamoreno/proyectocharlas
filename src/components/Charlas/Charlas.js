import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ApiService from "../../services/ApiService";
import Confetti from "react-confetti";
import "./Charlas.css";

const Charlas = () => {
  const { idRonda } = useParams();
  const [charlas, setCharlas] = useState([]);
  const [error, setError] = useState(null);
  const [modulo, setModulo] = useState("Módulo Desconocido");
  const [fechaPresentacion, setFechaPresentacion] = useState(null);
  const [contador, setContador] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [celebration, setCelebration] = useState(false);
  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [cerrada, setCerrada] = useState(false);
  const [datosCargados, setDatosCargados] = useState(false); // Control de datos cargados
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRondaInfo = async () => {
      try {
        const ronda = await ApiService.getRondaById(idRonda);
        setModulo(ronda.descripcionModulo || "Módulo sin nombre");
        const fechaPresentacionRonda = new Date(ronda.fechaPresentacion);
        setFechaPresentacion(fechaPresentacionRonda);
        setMostrarBotones(fechaPresentacionRonda > new Date());
        setDatosCargados(true); // Datos cargados correctamente
      } catch (err) {
        console.error("Error al obtener la información de la ronda:", err);
        setError("No se pudo cargar la información de la ronda.");
      }
    };

    const fetchCharlas = async () => {
      try {
        const response = await ApiService.getCharlasByRonda(idRonda);
        setCharlas(response);
      } catch (err) {
        console.error("Error al obtener las charlas:", err);
        setError("No se pudieron cargar las charlas.");
      }
    };

    fetchRondaInfo();
    fetchCharlas();
  }, [idRonda]);

  useEffect(() => {
    if (!fechaPresentacion) return;

    const interval = setInterval(() => {
      const now = new Date();
      const difference = fechaPresentacion.getTime() - now.getTime();

      if (difference <= 0) {
        setContador({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setCerrada(true);
        setCelebration(true);
        setMostrarBotones(false);

        setTimeout(() => setCelebration(false), 10000); // Detener confeti después de 10 segundos
        clearInterval(interval);
        return;
      }

      setContador({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fechaPresentacion]);

  const handleVote = (idCharla) => {
    if (celebration || votoSeleccionado || cerrada) return;
    setVotoSeleccionado(idCharla);
    alert(`Has votado por la charla: ${idCharla}`);
  };

  const goBack = () => {
    navigate("/rondas");
  };

  const goToNuevaCharla = () => {
    if (!cerrada && datosCargados) {
      navigate(`/charlas/${idRonda}/nuevacharla`);
    }
  };

  return (
    <div className="charlas-container">
      {celebration && <Confetti />}
      <button className="btn btn-back" onClick={goBack}>
        ←
      </button>
      <h1 className="text-center mb-4">{modulo}</h1>
      {fechaPresentacion && (
        <CountdownContainer cerrada={cerrada}>
          <h3>{cerrada ? "CERRADA" : "SE CIERRA EN"}</h3>
          {!cerrada && (
            <Loader>
              {`${contador.days}d ${contador.hours}h ${contador.minutes}m ${contador.seconds}s`}
            </Loader>
          )}
        </CountdownContainer>
      )}
      {mostrarBotones && datosCargados && !cerrada && (
        <AddButton onClick={goToNuevaCharla}>+ Agregar Charla</AddButton>
      )}
      {error && <p className="error">{error}</p>}
      {!error && charlas.length === 0 && (
        <p className="text-center">No hay charlas disponibles.</p>
      )}
      <div className="charlas-list">
        {charlas.map((charla) => (
          <div
            key={charla.idCharla}
            className={`charla-card ${votoSeleccionado === charla.idCharla ? "votada" : ""}`}
          >
            <img
              src={charla.imagenCharla || "https://siepcantabria.org/wp-content/uploads/2018/03/reunion.jpg"}
              alt="Charla"
              className="charla-image"
            />
            <div className="charla-info">
              <h3 className="charla-title">{charla.titulo}</h3>
              <p className="charla-description">
                {charla.descripcion.length > 150
                  ? `${charla.descripcion.slice(0, 150)}...`
                  : charla.descripcion}
              </p>
              <p>
                <strong>Duración:</strong> {charla.tiempo} minutos
              </p>
            </div>
            {mostrarBotones && !votoSeleccionado && !cerrada ? (
              <button
                className={`vote-btn ${votoSeleccionado === charla.idCharla ? "active" : ""}`}
                onClick={() => handleVote(charla.idCharla)}
              >
                👍
              </button>
            ) : votoSeleccionado === charla.idCharla ? (
              <span className="voted-msg">Votaste aquí</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

const CountdownContainer = styled.div`
  background-color: ${(props) => (props.cerrada ? "red" : "rgb(190, 209, 235)")};
  color: ${(props) => (props.cerrada ? "white" : "black")};
  padding: 20px;
  border-radius: 15px;
  margin: 20px auto;
  max-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Loader = styled.div`
  display: inline-flex;
  font-size: 30px;
  font-family: monospace;
  font-weight: bold;
  margin: 10px 0;
`;

const AddButton = styled.button`
  display: block;
  margin: 20px auto;
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;

  &:hover {
    background-color: #218838;
  }
`;

export default Charlas;
