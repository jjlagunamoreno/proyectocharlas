import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import ApiService from '../../services/ApiService';
import FileService from '../../services/FileService';
import Form from './Form';
import './Perfil.css'; // Importar el archivo de estilos
import { ProfileImageContext } from '../../context/ProfileImageContext';
import { PasswordContext } from '../../context/PasswordContext';
import errorImage from "../../assets/images/error404.png"; // Import fallback image
import { Link } from "react-router-dom";

export default function Perfil() {
  const [profile, setProfile] = useState(null);
  const [charlas, setCharlas] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const { profile: globalProfile, setProfile: setGlobalProfile } = useContext(ProfileImageContext);
  const { currentPassword } = useContext(PasswordContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ApiService.getUserProfile();
        setProfile(profileData.usuario);
        setGlobalProfile(profileData.usuario);
        setCharlas(profileData.charlas.map(c => c.charla));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [setGlobalProfile]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = reader.result;
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      try {
        const response = await FileService.uploadUserImage(profile.idUsuario, file.name, base64);
        const newFileUrl = response.urlFile; // Use the new URL from the response
        setFileUrl(newFileUrl);
        setProfile(prevProfile => ({ ...prevProfile, imagen: newFileUrl }));
        setGlobalProfile(prevProfile => ({ ...prevProfile, imagen: newFileUrl }));

        // Refrescar el token después de cambiar la imagen del perfil
        const newLoginResponse = await ApiService.login({
          userName: profile.email,
          password: currentPassword,
        });

        // Actualizar el contexto global del perfil con los datos correctos
        const refreshedProfileData = await ApiService.getUserProfile();
        setProfile(refreshedProfileData.usuario);
        setGlobalProfile(refreshedProfileData.usuario);

        alert("Imagen de perfil actualizada con éxito.");
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
  }, [profile, setGlobalProfile, currentPassword]);

  useEffect(() => {
    console.log('File URL updated:', fileUrl);
  }, [fileUrl]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleImageError = (e) => {
    e.target.src = errorImage; // Set fallback image on error
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account">
      <div className="account_info">
        <h1>Profile settings</h1>
        <p>You can set preferred display name, create your profile URL and manage other personal settings.</p>
      </div>
      <div className="account_box">
        <div className="account_box_img" {...getRootProps()}>
          <input {...getInputProps()} />
          <img
            src={fileUrl || profile.imagen}
            alt="account upload"
            className="account_box_img_img"
          />
          <p className="account_box_img_para">Change Image</p>
        </div>
        <div className="account_box_form">
          <Form />
        </div>
      </div>
      <div className="perfil-charlas">
        <h2>Charlas Propuestas</h2>
        {charlas.length === 0 ? (
          <p>No hay charlas propuestas.</p>
        ) : (
          <div className="perfil-charlas-grid">
            {charlas.map((charla, index) => (
              <Link key={index} to={`/detallescharla/${charla.idCharla}`} className="perfil-charla-link">
                <div className="perfil-charla-card">
                  <img src={charla.imagenCharla} alt={charla.titulo} className="perfil-charla-image" onError={handleImageError} />
                  <div className="perfil-charla-content">
                    <h3>{charla.titulo}</h3>
                    <p><strong>Descripción:</strong> {charla.descripcion}</p>
                    <p><strong>Fecha Propuesta:</strong> {new Date(charla.fechaPropuesta).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> {charla.estadoCharla}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
