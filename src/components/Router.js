import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './Menu/Menu';
import Login from './Login/Login';
import Home from './Home';
import NotFound404 from './NothingFoundBackground/NothingFoundBackground';

const Router = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <BrowserRouter>
            {isAuthenticated && <Menu />}
            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/home" element={<Home />} />
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
