import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import NotFound404 from './NotFound404';
import Login from './Login/Login';
import Menu from './Menu/Menu';
import ListaUsuarios from './Curso/ListaUsuarios';

const Router = () => {
    return (
        <BrowserRouter>
        <Menu/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/curso" element={<ListaUsuarios/>} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound404 />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
