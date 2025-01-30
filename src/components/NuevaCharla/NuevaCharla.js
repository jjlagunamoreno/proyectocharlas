import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import FileService from "../../services/FileService";
import Global from "../../utils/Global";
import "./NuevaCharla.css"

const NuevaCharla = () => {
  const { idRonda } = useParams();
  const navigate = useNavigate();

  const [charla, setCharla] = useState({
    idCharla: 0,
    titulo: "",
    descripcion: "",
    tiempo: 10,
    fechaPropuesta: new Date().toISOString().split("T")[0] + "T00:00:00",
    idUsuario: Global.userId || 0,
    idEstadoCharla: 1,
    idRonda: idRonda ? parseInt(idRonda, 10) : 0,
    imagenCharla: "",
  });

  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idRonda) {
      const rondaId = parseInt(idRonda, 10);
      if (!isNaN(rondaId)) {
        setCharla((prevCharla) => ({
          ...prevCharla,
          idRonda: rondaId,
        }));
      } else {
        setError("⚠️ Error: ID de ronda no válido en la URL.");
      }
    }
  }, [idRonda]);

  const handleChange = (e) => {
    setCharla({
      ...charla,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImagen(e.target.files[0]);
      console.log("🖼 Archivo seleccionado:", e.target.files[0]);
    } else {
      setImagen(null);
      console.log("⚠️ No se seleccionó ninguna imagen.");
    }
  };

  const convertirImagenBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof File)) {
        reject(new Error("El archivo seleccionado no es válido."));
        return;
      }
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        const buffer = reader.result;
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
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
        tiempo: parseInt(charla.tiempo, 10),
        idUsuario: Global.userId,
      };

      console.log("📡 Enviando JSON:", JSON.stringify(charlaData, null, 2));

      const nuevaCharla = await ApiService.createCharla(charlaData);
      console.log("✅ Charla creada con ID:", nuevaCharla.idCharla);

      if (imagen) {
        try {
          console.log("📡 Convirtiendo imagen a Base64...");
          const base64Imagen = await convertirImagenBase64(imagen);

          console.log("📡 Enviando imagen a la API...");
          await FileService.uploadCharlaImage(nuevaCharla.idCharla, imagen.name, base64Imagen);
          console.log("✅ Imagen subida correctamente");
        } catch (err) {
          console.error("🔥 Error al subir la imagen:", err);
          setError(`❌ Error al subir la imagen: ${err.message}`);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      navigate(`/charlas/${idRonda}`);
    } catch (err) {
      console.error("🔥 Error en NuevaCharla:", err);
      setError(`❌ Error: ${err.message}`);
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
          <label className="form-label">Duración (120 minutos maximo)</label>
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
