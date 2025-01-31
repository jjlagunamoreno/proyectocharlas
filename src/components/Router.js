import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu/Menu";
import Login from "./Login/Login";
import Home from "./Home";
import Rondas from "./Rondas/Rondas";
import Charlas from "./Charlas/Charlas";
import NuevaCharla from "./NuevaCharla/NuevaCharla";
import NotFound404 from "./NothingFoundBackground/NothingFoundBackground";
import ApiService from "../services/ApiService";
import Curso from "../components/Curso/ListaUsuarios";
import Perfil from "./Perfil/Perfil";
import CrearRonda from "./CrearRonda/CrearRonda";
import { ProfileImageProvider } from "../context/ProfileImageContext";
import { PasswordProvider } from "../context/PasswordContext";
import DetallesCharla from "../components/DetallesCharla/DetallesCharla";
import Admin from "./Admin/Admin";

const Router = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar si el usuario está autenticado al cargar la aplicación
        setIsAuthenticated(ApiService.isAuthenticated());
    }, []);

    return (
        <PasswordProvider>
            <ProfileImageProvider>
                <BrowserRouter>
                    {isAuthenticated && <Menu />}
                    <Routes>
                        {isAuthenticated ? (
                            <>
                                <Route path="/" element={<Home />} />
                                <Route path="/perfil" element={<Perfil />} />
                                <Route path="/curso" element={<Curso />} />
                                <Route path="/rondas" element={<Rondas />} />
                                <Route path="/admin" element={<Admin />} />
                                <Route path="/charlas/:idRonda" element={<Charlas />} />
                                <Route path="/detallescharla/:idCharla"
                                    element={<DetallesCharla />} />
                                <Route path="/charlas/:idRonda/nuevacharla" element={<NuevaCharla />} />
                                <Route path="/CrearRonda" element={<CrearRonda />} />
                                <Route path="*" element={<NotFound404 />} />
                            </>
                        ) : (
                            <>
                                <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        )}
                    </Routes>
                </BrowserRouter>
            </ProfileImageProvider>
        </PasswordProvider>
    );
};

export default Router;
