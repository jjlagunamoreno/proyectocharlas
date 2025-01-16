import React, { useState, useEffect } from "react";
import { HiOutlineMail } from "react-icons/hi";
import ApiService from "../../services/ApiService";
import "./Form.css";

const Form = () => {
  const [profile, setProfile] = useState({
    nombre: "",
    email: "",
    imagen: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ApiService.getUserProfile();
        setProfile({
          nombre: profileData.usuario.nombre,
          email: profileData.usuario.email,
          imagen: profileData.usuario.imagen,
          password: "", // No se obtiene la contraseña del perfil
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para actualizar el perfil del usuario
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
              value={profile.nombre}
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
                value={profile.email}
                onChange={handleChange}
                placeholder="Email*"
              />
            </div>
          </div>

          <div className="Form_box_input">
            <label htmlFor="imagen">Imagen</label>
            <input
              type="text"
              name="imagen"
              value={profile.imagen}
              onChange={handleChange}
              className="Form_box_input_userName"
            />
            <button type="button" className="button" onClick={() => {}}>
              Change Image
            </button>
          </div>

          <div className="Form_box_input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              className="Form_box_input_userName"
            />
          </div>

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
