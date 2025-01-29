import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./DetallesCharla.css";
import Global from "../../utils/Global";

const DetallesCharla = () => {
    const { idCharla } = useParams();
    const navigate = useNavigate();
    const [charla, setCharla] = useState(null);
    const [error, setError] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const fetchCharla = async () => {
        try {
            const response = await ApiService.getCharlaById(idCharla);
            setCharla(response);
            setComentarios(response.comentarios || []);
        } catch (error) {
            console.error("Error al cargar los detalles de la charla:", error);
            setError("No se pudo cargar la charla.");
        }
    };

    useEffect(() => {
        fetchCharla();
    }, [idCharla, reloadTrigger]);

    const handleAddComment = async () => {
        if (nuevoComentario.trim() === "") return;

        const nuevoComentarioObj = {
            idComentario: 0,
            idCharla: charla.charla.idCharla,
            idUsuario: Global.userId,
            contenido: nuevoComentario,
            fecha: new Date().toISOString(),
        };

        try {
            await ApiService.createComentario(nuevoComentarioObj);
            setNuevoComentario("");
            setReloadTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error al agregar el comentario:", error);
            setError("No se pudo agregar el comentario.");
        }
    };

    const handleEditComment = async (comentario) => {
        const nuevoContenido = prompt("Edita tu comentario:", comentario.contenido);
        if (nuevoContenido === null || nuevoContenido.trim() === "") return;

        const comentarioActualizado = {
            ...comentario,
            contenido: nuevoContenido,
            fecha: new Date().toISOString(),
        };

        try {
            await ApiService.updateComentario(comentarioActualizado);
            
        } catch (error) {
            console.error("Error al actualizar el comentario:", error);
        }
        fetchCharla();
    };

    const handleDeleteComment = async (idComentario) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

        try {
            await ApiService.deleteComentario(idComentario);
            
        } catch (error) {
            console.error("Error al eliminar el comentario:", error);
        }
        fetchCharla();
    };

    return (
        <div className="detalles-charla-container">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>←</button>

            {error && <div className="alert alert-danger">{error}</div>}
            {charla && (
                <div>
                    <h2>{charla.charla.titulo}</h2>
                    <p><strong>Descripción:</strong> {charla.charla.descripcion}</p>
                    <p><strong>Fecha Propuesta:</strong> {new Date(charla.charla.fechaPropuesta).toLocaleDateString()}</p>
                    <p><strong>Duración:</strong> {charla.charla.tiempo} minutos</p>
                    <img
                        src={charla.charla.imagenCharla || "https://via.placeholder.com/400x200?text=Sin+imagen+disponible"}
                        alt="Charla"
                        className="img-fluid rounded mb-3"
                    />

                    <h5>Recursos</h5>
                    {charla.recursos.length > 0 ? (
                        <ul className="list-group mb-3">
                            {charla.recursos.map((recurso) => (
                                <li key={recurso.idRecurso} className="list-group-item">
                                    <div>
                                        <p><strong>Nombre:</strong> {recurso.nombre}</p>
                                        <p><strong>Descripción:</strong> {recurso.descripcion}</p>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => window.open(recurso.url, "_blank")}>
                                        Abrir Enlace
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay recursos asociados.</p>
                    )}

                    <h5>Comentarios</h5>
                    {comentarios.length > 0 ? (
                        <div className="comentarios">
                            {comentarios.map((comentario, index) => (
                                <div key={index} className="comentario-item" style={{ backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}>
                                    <small className="text-muted">{new Date(comentario.fecha).toLocaleString()}</small>
                                    <p><strong>{comentario.usuario}:</strong> {comentario.contenido}</p>
                                    {`${Global.nombre} ${Global.apellido}` === comentario.usuario && (
                                        <div className="comentario-actions">
                                            <button className="btn btn-link text-primary" onClick={() => handleEditComment(comentario)}>✏️</button>
                                            <button className="btn btn-link text-danger" onClick={() => handleDeleteComment(comentario.idComentario)}>🗑️</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No hay comentarios.</p>
                    )}

                    {error && <div className="alert alert-danger">{error}</div>}

                    <textarea
                        className="form-control mb-3"
                        placeholder="Escribe un comentario..."
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={handleAddComment}>Agregar Comentario</button>
                </div>
            )}
        </div>
    );
};

export default DetallesCharla;
