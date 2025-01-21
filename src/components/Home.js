import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Global from '../utils/Global';
import ApiService from '../services/ApiService';

const roleDictionary = {
    1: "Profesor",
    2: "Alumno",
    3: "Administrador"
};

const Home = () => {
    const [userCourse, setUserCourse] = useState("");
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState(Global.role);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await ApiService.getUserProfile();
                setUserCourse(profile.usuario.curso || "Sin curso");
                setUserName(profile.usuario.nombre || "Usuario");
                setUserRole(profile.usuario.rol || "Desconocido");
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card text-center shadow-lg border-0" style={{ width: "400px" }}>
                <div className="card-header bg-primary text-white">
                    <h1 className="display-6">¡Hola, Bienvenido!</h1>
                </div>
                <div className="card-body">
                    <h5 className="card-title mb-3">Información de Usuario</h5>
                    <p className="card-text">
                        <strong>Nombre:</strong> {userName}
                    </p>
                    <p className="card-text">
                        <strong>Curso:</strong> {userCourse}
                    </p>
                    <p className="card-text">
                        <strong>Rol:</strong> {roleDictionary[Global.role] || "Desconocido"}
                    </p>
                </div>
                <div className="card-footer bg-light text-muted">
                    Plataforma de Gestión de Charlas
                </div>
            </div>
        </div>
    );
};

export default Home;
