import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./CrearRonda.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegurar Bootstrap

const CrearRonda = () => {
    const navigate = useNavigate();
    const [descripcionModulo, setDescripcionModulo] = useState("");
    const [fechaPresentacion, setFechaPresentacion] = useState("");
    const [fechaCierre, setFechaCierre] = useState("");
    const [fechaLimiteVotacion, setFechaLimiteVotacion] = useState("");
    const [duracion, setDuracion] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevaRonda = {
            idRonda: 0,
            idCursoUsuario: 0, // Se obtiene automáticamente en el backend
            fechaPresentacion,
            fechaCierre,
            duracion: parseInt(duracion, 10),
            descripcionModulo,
            fechaLimiteVotacion,
        };

        try {
            await ApiService.createRonda(nuevaRonda);
            alert("✅ Ronda creada con éxito.");
            navigate("/rondas"); // Redirigir a la página de rondas
        } catch (error) {
            console.error("⚠️ Error al crear la ronda:", error);
            setError("❌ No se pudo crear la ronda.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Crear Nueva Ronda</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="form-label">Descripción del Módulo:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={descripcionModulo}
                                    onChange={(e) => setDescripcionModulo(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Fecha de Presentación:</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={fechaPresentacion}
                                    onChange={(e) => setFechaPresentacion(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Fecha de Cierre:</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={fechaCierre}
                                    onChange={(e) => setFechaCierre(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="form-label">Fecha Límite de Votación:</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={fechaLimiteVotacion}
                                    onChange={(e) => setFechaLimiteVotacion(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Duración (minutos):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={duracion}
                                    onChange={(e) => setDuracion(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <div className="btn-group">
                            <button
                                type="submit"
                                className="btn btn-success"
                                style={{
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    borderColor: "#28a745",
                                    padding: "10px 15px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
                            >
                                ✅ Crear Ronda
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    borderColor: "#dc3545",
                                    padding: "10px 15px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
                                onClick={() => navigate("/rondas")}
                            >
                                ❌ Cancelar
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearRonda;
