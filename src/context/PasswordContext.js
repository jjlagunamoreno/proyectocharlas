import React, { createContext, useState } from 'react';

export const PasswordContext = createContext();

export const PasswordProvider = ({ children }) => {
  const [currentPassword, setCurrentPassword] = useState('');

  return (
    <PasswordContext.Provider value={{ currentPassword, setCurrentPassword }}>
      {children}
    </PasswordContext.Provider>
  );
};
