import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./Menu/Menu";
import Login from "./Login/Login";
import Home from "./Home";
import Rondas from "./Rondas/Rondas";
import NotFound404 from "./NothingFoundBackground/NothingFoundBackground";
import ApiService from "../services/ApiService";

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
                        <Route path="/rondas" element={<Rondas />} />
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
