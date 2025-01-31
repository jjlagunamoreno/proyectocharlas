import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ApiService from "../../services/ApiService";
import Confetti from "react-confetti";
import "./Charlas.css";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Link } from "react-router-dom";
import Global from "../../utils/Global"

const Charlas = () => {
  const { idRonda } = useParams();
  const [charlas, setCharlas] = useState([]);
  const [error, setError] = useState(null);
  const [modulo, setModulo] = useState("Módulo Desconocido");
  const [fechaPresentacion, setFechaPresentacion] = useState(null);
  const [contador, setContador] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [celebration, setCelebration] = useState(false);
  const [charlaCreada, setCharlaCreada] = useState(false);
  const [mostrarBotones, setMostrarBotones] = useState(false);
  const [cerrada, setCerrada] = useState(false);
  const [datosCargados, setDatosCargados] = useState(false); // Control de datos cargados
  const [votoUsuario, setVotoUsuario] = useState(null);
  const [charlaSeleccionada, setCharlaSeleccionada] = useState(null);

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

  const handleDeleteRonda = async (idRonda) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la ronda y todas sus charlas. No se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      try {
        await ApiService.deleteRonda(idRonda);
        Swal.fire("Ronda eliminada", "La ronda ha sido eliminada correctamente.", "success");
        navigate("/rondas"); // Redirigir tras la eliminación
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la ronda.", "error");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ronda, charlasLista, voto] = await Promise.all([
          ApiService.getRondaById(idRonda),
          ApiService.getCharlasByRonda(idRonda),
          ApiService.getVotoAlumnoRonda(idRonda),
        ]);

        setModulo(ronda.descripcionModulo || "Módulo sin nombre");
        setFechaPresentacion(new Date(ronda.fechaPresentacion));
        setCerrada(new Date(ronda.fechaPresentacion) < new Date());
        setVotoUsuario(voto?.idCharla || null);
        setDatosCargados(true);

        // ✅ Ordenar charlas: Si hay una charla votada, se mueve al inicio de la lista
        if (voto?.idCharla) {
          const charlaVotada = charlasLista.find((charla) => charla.idCharla === voto.idCharla);
          const otrasCharlas = charlasLista.filter((charla) => charla.idCharla !== voto.idCharla);
          setCharlas([charlaVotada, ...otrasCharlas]); // ✅ Charla votada al inicio
        } else {
          setCharlas(charlasLista); // Si no hay voto, mantener el orden normal
        }

      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudieron cargar los datos.");
      }
    };

    fetchData();
  }, [idRonda]);

  useEffect(() => {
    const fetchCharlasUsuario = async () => {
      try {
        const response = await ApiService.getCharlasByRonda(idRonda);
        const usuarioId = Global.userId; // Asegúrate de tener el ID del usuario autenticado
        const charlaDelUsuario = response.some(charla => charla.idUsuario === usuarioId);
        setCharlaCreada(charlaDelUsuario);
      } catch (err) {
        console.error("Error al verificar si el usuario ya creó una charla:", err);
      }
    };

    fetchCharlasUsuario();
  }, [idRonda]);


  useEffect(() => {
    const fetchCharlaSeleccionada = async () => {
      if (cerrada) {
        try {
          const charlasAceptadas = await ApiService.getCharlasByRondaEstado(idRonda, 2); // 2 = Charlas Aceptadas
          if (charlasAceptadas.length > 0) {
            setCharlaSeleccionada(charlasAceptadas[0]); // Toma la primera charla aceptada
          } else {
            setCharlaSeleccionada(null); // No hay charlas aceptadas
          }
        } catch (error) {
          console.error("Error al obtener la charla seleccionada:", error);
        }
      }
    };

    fetchCharlaSeleccionada();
  }, [cerrada, idRonda]);

  useEffect(() => {
    const fetchVotoUsuario = async () => {
      try {
        const voto = await ApiService.getVotoAlumnoRonda(idRonda);
        setVotoUsuario(voto?.idCharla || null);
      } catch (err) {
        console.error("Error al obtener el voto del usuario:", err);
      }
    };

    fetchVotoUsuario();
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
        clearInterval(interval);

        setTimeout(() => setCelebration(false), 10000); // Detener confeti después de 10 segundos
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


  const handleVote = async (idCharla) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Solo puedes votar una vez por charla. ¿Confirmas tu voto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, votar",
      cancelButtonText: "Cancelar",
    });

    if (isConfirmed) {
      try {
        await ApiService.votarCharla(idCharla, idRonda);
        setVotoUsuario(idCharla);

        // ✅ Mover la charla votada al inicio
        const charlaVotada = charlas.find((charla) => charla.idCharla === idCharla);
        const otrasCharlas = charlas.filter((charla) => charla.idCharla !== idCharla);
        setCharlas([charlaVotada, ...otrasCharlas]);

        Swal.fire("Voto registrado", "Tu voto se ha registrado con éxito.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo registrar tu voto. Inténtalo de nuevo.", "error");
      }
    }
  };

  const goBack = () => {
    navigate("/rondas");
  };

  const goToNuevaCharla = () => {
    if (!cerrada && datosCargados) {
      navigate(`/charlas/${idRonda}/nuevacharla`);
    }
  };

  const isValidImage = (url) => {
    if (!url) return false; // Si no hay URL, no es válida.
    const image = new Image();
    image.src = url;

    // Validar si la URL es válida comprobando el formato MIME y errores de carga
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
    return isImage;
  };

  return (
    <div className="charlas-container">
      {celebration && <Confetti />}
      <button className="btn btn-back" onClick={goBack}>
        ←
      </button>
      <h1 className="text-center mb-4">{modulo}</h1>
      {fechaPresentacion && (
        <CountdownContainer $cerrada={cerrada}>
          <h3>{cerrada ? "CERRADA" : "SE CIERRA EN"}</h3>
          {!cerrada && (
            <Loader>
              {`${contador.days}d ${contador.hours}h ${contador.minutes}m ${contador.seconds}s`}
            </Loader>
          )}
        </CountdownContainer>
      )}
      {mostrarBotones && datosCargados && !cerrada && !charlaCreada && (
        <AddButton onClick={goToNuevaCharla}>+ Agregar Charla</AddButton>
      )}

      {Global.role === 1 && (
        <button
          className="btn btn-danger mt-3"
          style={{
            backgroundColor: "#dc3545",
            borderColor: "#dc3545",
            padding: "10px 15px",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => handleDeleteRonda(idRonda)}
        >
          ❌ Eliminar Ronda
        </button>

      )}

      {error && <p className="error">{error}</p>}
      {!error && charlas.length === 0 && (
        <p className="text-center">No hay charlas disponibles.</p>
      )}
      {cerrada && (
        <>
          {charlaSeleccionada ? (
            // Mostrar la charla seleccionada
            <div className="charla-seleccionada">
              <div className="charla-card">
                <img
                  src={isValidImage(charlaSeleccionada.imagenCharla)
                    ? charlaSeleccionada.imagenCharla
                    : "https://siepcantabria.org/wp-content/uploads/2018/03/reunion.jpg"}
                  alt="Charla Seleccionada"
                  className="charla-image"
                  onError={(e) => {
                    e.target.src = "https://siepcantabria.org/wp-content/uploads/2018/03/reunion.jpg";
                  }}
                />
                <div className="charla-info">
                  <h3 className="charla-title">{charlaSeleccionada.titulo}</h3>
                  <p className="charla-description">
                    {charlaSeleccionada.descripcion.length > 150
                      ? `${charlaSeleccionada.descripcion.slice(0, 150)}...`
                      : charlaSeleccionada.descripcion}
                  </p>
                  <p>
                    <strong>Duración:</strong> {charlaSeleccionada.tiempo} minutos
                  </p>
                  <p>
                    <strong>Propuesta por:</strong> {charlaSeleccionada.usuario}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Casos en los que no hay charla seleccionada
            <>
              {charlas.length === 0 ? (
                <p className="text-center">No hay charlas disponibles.</p>
              ) : (
                <p className="text-center">
                  No hay una charla favorita o hay un empate entre varias charlas.
                </p>
              )}
            </>
          )}
        </>
      )}
      <div className="charlas-list">
        {charlas
          .filter((charla) => {
            const now = new Date();
            const fechaCharla = new Date(fechaPresentacion);
            return fechaCharla >= now;
          })
          .map((charla) => (
            <div
              key={charla.idCharla}
              className={`charla-card ${votoUsuario === charla.idCharla ? "votada" : ""}`}
            >
              <Link to={`/detallescharla/${charla.idCharla}`} className="text-decoration-none">

                <img
                  src={isValidImage(charla.imagenCharla)
                    ? charla.imagenCharla
                    : "https://siepcantabria.org/wp-content/uploads/2018/03/reunion.jpg"}
                  alt="Charla"
                  className="charla-image"
                  onError={(e) => {
                    e.target.src = "https://siepcantabria.org/wp-content/uploads/2018/03/reunion.jpg";
                  }}
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
              </Link>
              {!votoUsuario && !cerrada ? (
                <button
                  className="vote-btn"
                  onClick={() => handleVote(charla.idCharla)}
                >
                  👍
                </button>
              ) : votoUsuario === charla.idCharla ? (
                <span className="voted-msg">Charla Votada</span>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
};

const CountdownContainer = styled.div`
    background-color: ${(props) => (props.$cerrada ? "red" : "rgb(190, 209, 235)")};
    color: ${(props) => (props.$cerrada ? "white" : "black")};
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