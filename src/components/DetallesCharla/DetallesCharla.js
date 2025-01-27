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

    useEffect(() => {
        const fetchCharla = async () => {
            try {
                const response = await ApiService.getCharlaById(idCharla);
                setCharla(response);
                console.log("Comentarios recibidos:", response.comentarios); // Depuración
                setComentarios(response.comentarios || []);
            } catch (error) {
                console.error("Error al cargar los detalles de la charla:", error);
                setError("No se pudo cargar la charla.");
            }
        };

        fetchCharla();
    }, [idCharla]);

    const handleAddComment = async () => {
        if (nuevoComentario.trim() === "") return;

        const nuevoComentarioObj = {
            idComentario: 0, // Generado automáticamente
            idCharla: charla.charla.idCharla, // ID de la charla actual
            idUsuario: Global.userId, // ID del usuario autenticado
            contenido: nuevoComentario,
            fecha: new Date().toISOString(), // Fecha actual
        };

        try {
            const createdComment = await ApiService.createComentario(nuevoComentarioObj);
            const comentarioConUsuario = { ...createdComment, usuario: Global.username };
            setComentarios([...comentarios, comentarioConUsuario]); // Agrega el comentario creado a la lista
            setNuevoComentario(""); // Limpia el campo de texto
        } catch (error) {
            console.error("Error al agregar el comentario:", error);
            setError("No se pudo agregar el comentario. Inténtalo de nuevo.");
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
            setComentarios((prevComentarios) =>
                prevComentarios.map((c) =>
                    c.idComentario === comentario.idComentario ? comentarioActualizado : c
                )
            );
        } catch (error) {
            console.error("Error al actualizar el comentario:", error);
            setError("No se pudo actualizar el comentario.");
        }
    };

    const handleDeleteComment = async (idComentario) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

        try {
            await ApiService.deleteComentario(idComentario);
            setComentarios((prevComentarios) =>
                prevComentarios.filter((comentario) => comentario.idComentario !== idComentario)
            );
        } catch (error) {
            console.error("Error al eliminar el comentario:", error);
            setError("No se pudo eliminar el comentario.");
        }
    };

    return (
        <div className="detalles-charla-container">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                ←
            </button>

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

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => window.open(recurso.url, "_blank")}
                                    >
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
                                <div key={index} className="comentario-item">
                                    <p><strong>{comentario.usuario}:</strong> {comentario.contenido}</p>
                                    <small className="text-muted">
                                        {new Date(comentario.fecha).toLocaleString()}
                                    </small>
                                    {comentario.usuarioId === Global.userId && (
                                        <div className="comentario-actions">
                                            <button
                                                className="btn btn-link text-primary"
                                                onClick={() => handleEditComment(comentario)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-link text-danger"
                                                onClick={() => handleDeleteComment(comentario.idComentario)}
                                            >
                                                🗑️
                                            </button>
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
                    <button className="btn btn-success" onClick={handleAddComment}>
                        Agregar Comentario
                    </button>

                </div>
            )}
        </div>
    );
};

export default DetallesCharla;
