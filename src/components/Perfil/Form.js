import React, { useState, useEffect, useContext } from "react";
import { HiOutlineMail } from "react-icons/hi";
import ApiService from "../../services/ApiService";
import "./Form.css";
import { ProfileImageContext } from '../../context/ProfileImageContext';

const Form = () => {
  const { profile, setProfile } = useContext(ProfileImageContext);
  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ApiService.getUserProfile();
        setProfile({
          idUsuario: profileData.usuario.idUsuario,
          nombre: profileData.usuario.nombre,
          apellidos: profileData.usuario.apellidos,
          email: profileData.usuario.email,
          imagen: profileData.usuario.imagen,
          idRole: profileData.usuario.idRole,
        });
        setLocalProfile({
          idUsuario: profileData.usuario.idUsuario,
          nombre: profileData.usuario.nombre,
          apellidos: profileData.usuario.apellidos,
          email: profileData.usuario.email,
          imagen: profileData.usuario.imagen,
          idRole: profileData.usuario.idRole,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [setProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile({ ...localProfile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localProfile.email.endsWith("@tajamar365.com")) {
      setError("El correo electrónico debe ser @tajamar365.com");
      return;
    }

    if (!currentPassword) {
      setError("Por favor, introduce tu contraseña actual.");
      return;
    }

    try {
      // Verificar la contraseña actual
      const loginResponse = await ApiService.login({
        userName: localProfile.email,
        password: currentPassword,
      });

      console.log("loginResponse:", loginResponse); // Imprimir el loginResponse en la consola

      if (loginResponse.token) {
        // Actualizar el perfil del usuario
        const updatedProfile = {
          idUsuario: localProfile.idUsuario,
          nombre: localProfile.nombre,
          apellidos: localProfile.apellidos,
          email: localProfile.email,
          estadoUsuario: true,
          imagen: localProfile.imagen,
          password: currentPassword, // Usar la contraseña actual
          idRole: localProfile.idRole,
        };

        console.log("JSON enviado:", JSON.stringify(updatedProfile)); // Imprimir el JSON en la consola

        const updateResponse = await ApiService.updateUserProfile(updatedProfile);
        console.log("updateResponse:", updateResponse); // Imprimir la respuesta de la actualización

        // Actualizar el contexto global del perfil
        setProfile(updatedProfile);

        alert("Perfil actualizado con éxito.");
        setError(""); // Limpiar el mensaje de error
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("No se pudo actualizar el perfil.");
    }
  };

  return (
    <div className="Form">
      <div className="Form_box">
        <form onSubmit={handleSubmit}>
          <div className="Form_box_input">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={localProfile.nombre}
              onChange={handleChange}
              className="Form_box_input_userName"
            />
          </div>

          <div className="Form_box_input">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={localProfile.apellidos}
              onChange={handleChange}
              className="Form_box_input_userName"
            />
          </div>

          <div className="Form_box_input">
            <label htmlFor="email">Email</label>
            <div className="Form_box_input_box">
              <div className="Form_box_input_box_icon">
                <HiOutlineMail />
              </div>
              <input
                type="text"
                name="email"
                value={localProfile.email}
                onChange={handleChange}
                placeholder="Email*"
              />
            </div>
          </div>

          <div className="Form_box_input">
            <label htmlFor="currentPassword">Contraseña Actual</label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handlePasswordChange}
              className="Form_box_input_userName"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="Form_box_btn">
            <button type="submit" className="button">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
