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

const Router = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar si el usuario está autenticado al cargar la aplicación
        setIsAuthenticated(ApiService.isAuthenticated());
    }, []);

    return (
        <BrowserRouter>
            {isAuthenticated && <Menu />}
            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={<Home />} />
                        <Route path="/curso" element={<Curso />} />
                        <Route path="/rondas" element={<Rondas />} />
                        <Route path="/charlas/:idRonda" element={<Charlas />} />
                        <Route path="/charlas/:idRonda/nuevacharla" element={<NuevaCharla />} />
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
    );
};

export default Router;
