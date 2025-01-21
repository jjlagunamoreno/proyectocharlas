import React, { createContext, useState } from 'react';

export const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    idUsuario: 0,
    nombre: '',
    apellidos: '',
    email: '',
    imagen: '',
    idRole: 0,
  });

  return (
    <ProfileImageContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileImageContext.Provider>
  );
};
