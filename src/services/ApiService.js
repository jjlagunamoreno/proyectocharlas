import Global from "../utils/Global";

const ApiService = {
    //-- COMPONENTE Login
    login: async (credentials) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Auth/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            Global.token = `Bearer ${data.response}`;
            return { token: data.response, role: data.idrole };
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    // COMPONENTE Perfil
    getUserProfile: async () => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Usuarios/Perfil`, {
                method: "GET",
                headers: {
                    Authorization: Global.token,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user profile");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    updateUserProfile: async (profile) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Usuarios`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Global.token,
                },
                body: JSON.stringify(profile),
            });

            if (!response.ok) {
                throw new Error("Failed to update user profile");
            }

            const responseData = await response.text();
            return responseData ? JSON.parse(responseData) : {};
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    // COMPONENTE Rondas y Charlas
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

    getCharlasByRondaEstado: async (idRonda, idEstado) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Charlas/CharlasRondaEstado/${idRonda}/${idEstado}`, {
                headers: {
                    Authorization: Global.token,
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener las charlas por estado");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getCharlasByRondaEstado:", error);
            throw error;
        }
    },

    getRondaById: async (idRonda) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Rondas/${idRonda}`, {
                headers: { Authorization: Global.token },
            });

            if (!response.ok) {
                throw new Error("Error al obtener la información de la ronda");
            }

            const data = await response.json();
            data.fechaCierre = data.fechaCierre ? new Date(data.fechaCierre) : null;
            return data;
        } catch (error) {
            console.error("Error en getRondaById:", error);
            throw error;
        }
    },

    getVotoAlumnoRonda: async (idRonda) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Votos/VotoAlumnoRonda/${idRonda}`, {
                headers: {
                    Authorization: Global.token,
                },
            });

            if (!response.ok) {
                if (response.status === 404) return null; // Sin votos para esta ronda
                throw new Error("Error al obtener el voto del alumno");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getVotoAlumnoRonda:", error);
            throw error;
        }
    },

    votarCharla: async (idCharla, idRonda) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Votos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Global.token,
                },
                body: JSON.stringify({
                    idVoto: 0, // ID generado automáticamente por el backend
                    idCharla,
                    idUsuario: Global.userId, // Usa el ID del usuario almacenado
                    idRonda,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al registrar el voto");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en votarCharla:", error);
            throw error;
        }
    },

    // FUNCIÓN PARA VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
    isAuthenticated: () => {
        return !!Global.token;
    },
};

export default ApiService;
