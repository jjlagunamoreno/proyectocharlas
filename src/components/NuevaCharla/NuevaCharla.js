import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import Global from "../../utils/Global";

const NuevaCharla = () => {
  const { idRonda } = useParams();  // Obtener ID de la ronda desde la URL
  const navigate = useNavigate();

  const [charla, setCharla] = useState(null);  // Inicializar como null
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idRonda) {
      const rondaId = parseInt(idRonda, 10);
      if (!isNaN(rondaId)) {
        setCharla({
          titulo: "",
          descripcion: "",
          tiempo: 0,
          fechaPropuesta: new Date().toISOString(),
          idUsuario: Global.userId || 0,  // Asegurar que tiene un valor válido
          idEstadoCharla: 1,  // Estado inicial (ajustar si es necesario)
          idRonda: rondaId,  // USAR idRonda CORRECTAMENTE
          imagenCharla: "",
        });
      } else {
        setError("Error: ID de ronda no válido en la URL.");
      }
    }
  }, [idRonda]);

  if (!charla) {
    return <p className="text-danger">Cargando...</p>;
  }

  const handleChange = (e) => {
    setCharla({
      ...charla,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!Global.token) {
      console.error("⚠️ Error: No hay token de autenticación.");
      setError("Error: No hay token de autenticación.");
      setLoading(false);
      return;
    }

    try {
      const charlaData = {
        ...charla,
        tiempo: parseInt(charla.tiempo, 10), // Convertir a número
      };

      console.log("📡 Enviando JSON:", JSON.stringify(charlaData, null, 2));

      const nuevaCharla = await ApiService.createCharla(charlaData);
      console.log("✅ Charla creada con ID:", nuevaCharla.idCharla);

      if (imagen) {
        const formData = new FormData();
        formData.append("fileName", imagen.name);

        const reader = new FileReader();
        reader.readAsDataURL(imagen);
        reader.onload = async () => {
          formData.append("fileContent", reader.result.split(",")[1]); // Solo Base64

          await ApiService.uploadImagenCharla(nuevaCharla.idCharla, formData);
          console.log("✅ Imagen subida correctamente");
          setLoading(false);
          navigate(`/charlas/${idRonda}`);
        };
      } else {
        setLoading(false);
        navigate(`/charlas/${idRonda}`);
      }
    } catch (err) {
      console.error("🔥 Error en NuevaCharla:", err);
      setError("Error al crear la charla. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Agregar Nueva Charla</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            name="titulo"
            value={charla.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            value={charla.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Duración (minutos)</label>
          <input
            type="number"
            className="form-control"
            name="tiempo"
            value={charla.tiempo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen de la charla (opcional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar Charla"}
        </button>
      </form>
    </div>
  );
};

export default NuevaCharla;
