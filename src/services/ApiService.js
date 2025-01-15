import Global from "../utils/Global";

const ApiService = {
    // -- FUNCIÓN PARA INICIAR SESIÓN --
    login: async (credentials) => {
        try {
            // REALIZA UNA PETICIÓN POST A LA API DE LOGIN
            const response = await fetch(`${Global.urlAlumnos}api/Auth/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            // SI EL RESPONSE NO ES EXITOSO, LANZA UN ERROR
            if (!response.ok) {
                throw new Error("Login failed");
            }

            // PARSEA LA RESPUESTA A JSON
            const data = await response.json();

            // GUARDA EL TOKEN EN GLOBAL
            Global.token = `Bearer ${data.response}`;

            // DEVUELVE EL TOKEN Y EL ROL DEL USUARIO
            return { token: data.response, role: data.idrole };
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    // -- FUNCIÓN PARA REGISTRAR UN NUEVO ALUMNO --
    registerAlumno: async (codigoCurso, alumnoData) => {
        try {
            // REALIZA UNA PETICIÓN POST PARA REGISTRAR UN ALUMNO
            const response = await fetch(
                `${Global.urlAlumnos}api/Usuarios/NewAlumno/${codigoCurso}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: Global.token, // SE INCLUYE EL TOKEN DE AUTORIZACIÓN
                    },
                    body: JSON.stringify(alumnoData),
                }
            );

            // SI EL RESPONSE NO ES EXITOSO, LANZA UN ERROR
            if (!response.ok) {
                throw new Error("Registration failed");
            }

            // PARSEA Y DEVUELVE LA RESPUESTA
            return await response.json();
        } catch (error) {
            console.error("Registration error (Alumno):", error);
            throw error;
        }
    },

    // FUNCIÓN PARA VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
    isAuthenticated: () => {
        // RETORNA TRUE SI EXISTE UN TOKEN EN GLOBAL
        return !!Global.token;
    },

    // FUNCIÓN PARA CERRAR SESIÓN
    logout: () => {
        // ELIMINA EL TOKEN GUARDADO EN GLOBAL
        Global.token = null;
    },

    // -- LLAMADA PARA SERVICIO CHARLAS POR RONDA --
    getCharlasByRonda: async (idRonda) => {
        try {
        const response = await fetch(`${Global.urlAlumnos}api/Charlas/CharlasRonda/${idRonda}`, {
            headers: {
            Authorization: Global.token,
            },
        });
    
        if (!response.ok) {
            throw new Error("Error al obtener las charlas");
        }
    
        return await response.json();
        } catch (error) {
        console.error(error);
        throw error;
        }
    },
    
    // OBTENER LA INFORMACIÓN DE UNA RONDA POR SU ID
    getRondaById: async (idRonda) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Rondas/${idRonda}`, {
                headers: {
                    Authorization: Global.token,
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener la información de la ronda");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getRondaById:", error);
            throw error;
        }
    },

};

export default ApiService;
