// ./components/Home.js
import React from 'react';
import style from './Home.css'
import Global from '../utils/Global';

const Home = () => {
    return (
        <div className='container'>
            <h1>Hola, Bienvenido!!</h1>
            <h3>{Global.role}</h3>
        </div>
    );
};

export default Home;
