import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Home from './Home';
import About from './About';
import NotFound404 from './NotFound404';
import Login from './Login/Login';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound404 />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
