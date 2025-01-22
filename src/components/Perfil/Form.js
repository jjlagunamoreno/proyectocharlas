import React, { useState, useEffect, useContext } from "react";
import { HiOutlineMail } from "react-icons/hi";
import ApiService from "../../services/ApiService";
import "./Form.css";
import { ProfileImageContext } from '../../context/ProfileImageContext';
import { PasswordContext } from '../../context/PasswordContext';

const Form = () => {
  const { profile, setProfile } = useContext(ProfileImageContext);
  const { setCurrentPassword: setGlobalCurrentPassword, currentPassword } = useContext(PasswordContext);
  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [localCurrentPassword, setLocalCurrentPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ApiService.getUserProfile();
        setProfile(profileData.usuario);
        setLocalProfile(profileData.usuario);
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
    setLocalCurrentPassword(e.target.value);
    setGlobalCurrentPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localProfile.email.endsWith("@tajamar365.com")) {
      setError("El correo electrónico debe ser @tajamar365.com");
      return;
    }

    if (!localCurrentPassword) {
      setError("Por favor, introduce tu contraseña actual.");
      return;
    }

    try {
      // Verificar la contraseña actual
      const loginResponse = await ApiService.login({
        userName: localProfile.email,
        password: localCurrentPassword,
      });

      if (!loginResponse.token) {
        setError("Contraseña incorrecta.");
        return;
      }

      // Actualizar el perfil del usuario
      const updatedProfile = {
        ...localProfile,
        imagen: profile.imagen, // Usar la nueva URL de la imagen
        password: localCurrentPassword, // Usar la contraseña actual
      };

      console.log("JSON enviado:", JSON.stringify(updatedProfile)); // Imprimir el JSON en la consola

      const updateResponse = await ApiService.updateUserProfile(updatedProfile);
      console.log("updateResponse:", updateResponse); // Imprimir la respuesta de la actualización

      // Refrescar el token después de actualizar el perfil
      const newLoginResponse = await ApiService.login({
        userName: localProfile.email,
        password: localCurrentPassword,
      });

      // Actualizar el contexto global del perfil con los datos correctos
      const refreshedProfileData = await ApiService.getUserProfile();
      setProfile(refreshedProfileData.usuario);

      alert("Perfil actualizado con éxito.");
      setError(""); // Limpiar el mensaje de error
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
              value={localCurrentPassword}
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
