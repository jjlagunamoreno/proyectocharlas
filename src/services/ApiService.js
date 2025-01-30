import Global from "../utils/Global";

const ApiService = {
    //-- COMPONENTE Login
    login: async (credentials) => {
        try {
            // Primera solicitud: Obtener el token
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

            // Segunda solicitud: Obtener el perfil del usuario
            const profileResponse = await fetch(`${Global.urlAlumnos}api/Usuarios/Perfil`, {
                method: "GET",
                headers: { Authorization: Global.token },
            });

            if (!profileResponse.ok) {
                throw new Error("No se pudo obtener el perfil del usuario.");
            }

            const userProfile = await profileResponse.json();
            const usuario = userProfile.usuario;

            // Guardar los datos del usuario en Global
            Global.userId = usuario.idUsuario;
            Global.role = usuario.idRole;
            Global.nombre = usuario.nombre;
            Global.apellido = usuario.apellidos;
            Global.estadoUsuario = usuario.estadoUsuario;

            // Si el usuario está inactivo, impedir acceso
            if (!usuario.estadoUsuario) {
                throw new Error("Tu cuenta está inactiva. No puedes acceder a la plataforma.");
            }

            return {
                token: data.response,
                role: usuario.idRole,
                userId: usuario.idUsuario,
                nombre: usuario.nombre,
                apellido: usuario.apellidos,
                estadoUsuario: usuario.estadoUsuario
            };
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

    updateUserPassword: async (passwordData) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Usuarios/UpdatePasswordUsuario`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Global.token,
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                throw new Error("Failed to update user password");
            }

            const responseData = await response.text();
            return responseData ? JSON.parse(responseData) : {};
        } catch (error) {
            console.error("Error updating user password:", error);
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

    // DETALLESCHARLAS
    getCharlaById: async (idCharla) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Charlas/${idCharla}`, {
                headers: { Authorization: Global.token },
            });

            if (!response.ok) {
                throw new Error("Charla no encontrada");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getCharlaById:", error);
        }
    },

    updateEstadoUsuario: async (idUsuario, estado) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Usuarios/UpdateEstadoUsuario/${idUsuario}/${estado}`, {
                method: "PUT",
                headers: { Authorization: Global.token },
            });

            if (!response.ok) {
                throw new Error("Error al cambiar el estado del usuario");
            }
        } catch (error) {
            console.error("Error en updateEstadoUsuario:", error);
            throw error;
        }
    },

    // COMPONENTE Comentarios
    createComentario: async (comentario) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Comentarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Global.token,
                },
                body: JSON.stringify(comentario),
            });

            if (!response.ok) {
                throw new Error("Error al crear el comentario");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en createComentario:", error);
            throw error;
        }
    },

    // Actualizar un comentario
    updateComentario: async (comentario) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Comentarios`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: Global.token,
                },
                body: JSON.stringify(comentario),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el comentario");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en updateComentario:", error);
            throw error;
        }
    },

    // Eliminar un comentario
    deleteComentario: async (idComentario) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Comentarios/${idComentario}`, {
                method: "DELETE",
                headers: {
                    Authorization: Global.token,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el comentario");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en deleteComentario:", error);
        }
    },

    updateEstadoUsuariosSeleccionados: async (userIds, estado) => {
        try {
            for (let i = 0; i < userIds.length; i++) {
                const response = await fetch(`${Global.urlAlumnos}api/Usuarios/UpdateEstadoUsuario/${userIds[i]}/${estado}`, {
                    method: "PUT",
                    headers: { Authorization: Global.token },
                });

                if (!response.ok) {
                    throw new Error("Error al cambiar el estado del usuario");
                }
            }

        } catch (error) {
            console.error("Error en updateEstadoUsuario:", error);
            throw error;
        }
    },

    // Eliminar una charla
    deleteCharla: async (idCharla) => {
        try {
            if (!Global.token) {
                throw new Error("No hay un token de autenticación disponible.");
            }

            console.log(`🔄 Eliminando charla con ID: ${idCharla}`);
            console.log(`🔑 Usando token: ${Global.token}`);

            const response = await fetch(`${Global.urlAlumnos}api/Charlas/${idCharla}`, {
                method: "DELETE",
                headers: {
                    "Authorization": Global.token, // Usar el token correctamente
                    "Accept": "*/*"
                },
            });

            console.log(`📡 Respuesta de la API (DELETE Charla ${idCharla}):`, response);

            if (response.status === 401) {
                throw new Error("🔒 No autorizado. Verifica el token de autenticación.");
            }
            if (response.status === 404) {
                throw new Error("❌ No se encontró la charla para eliminar.");
            }
            if (!response.ok) {
                throw new Error("⚠️ Charla ya votada, no podemos eliminarla.");
            }

            console.log("✅ Charla eliminada correctamente.");
            return true;
        } catch (error) {
            console.error("🔥 Error en deleteCharla:", error);
            throw error;
        }
    },

    createCharla: async (charlaData) => {
        try {
            if (!Global.token) {
                throw new Error("⚠️ Error: No hay token de autenticación.");
            }

            console.log("📡 Enviando solicitud a la API de Charlas...");
            console.log("🔹 Datos de la charla:", JSON.stringify(charlaData, null, 2));
            console.log("🔑 Token actual:", Global.token); // <-- Verificar token en consola

            const response = await fetch(`${Global.urlAlumnos}api/Charlas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Global.token.includes("Bearer") ? Global.token : `Bearer ${Global.token}`, // ✅ Corregir doble "Bearer"
                },
                body: JSON.stringify(charlaData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("⚠️ Respuesta de la API:", errorText);
                throw new Error(`Error al crear la charla: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("🔥 Error en createCharla:", error);
            throw error;
        }
    },

    // Subir imagen de la charla
    uploadImagenCharla: async (idCharla, file) => {
        try {
            if (!(file instanceof File)) {
                throw new Error("El archivo de imagen no es válido.");
            }

            const formData = new FormData();
            formData.append("file", file);
            console.log("📡 Enviando imagen al servidor...");

            const response = await fetch(`${Global.urlAlumnos}api/Files/UploadImagenCharla/${idCharla}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${Global.token}`, // No incluir "Content-Type"
                },
                body: formData, // Enviar `FormData`
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("⚠️ Respuesta de la API (subida de imagen):", errorText);
                throw new Error(`Error al subir imagen: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("🔥 Error en uploadImagenCharla:", error);
            throw error;
        }
    },

    // FUNCIÓN PARA VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
    isAuthenticated: () => {
        return !!Global.token;
    },

    getRondas: async () => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Rondas/RondasCurso`, {
                headers: {
                    Authorization: Global.token,
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener las rondas");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en getRondas:", error);
            throw error;
        }
    },

    getProximaRonda: async () => {
        try {
            const rondas = await ApiService.getRondas();
            const now = new Date();
            const proximaRonda = rondas
                .filter(ronda => new Date(ronda.fechaPresentacion) > now)
                .sort((a, b) => new Date(a.fechaPresentacion) - new Date(b.fechaPresentacion))[0];

            return proximaRonda;
        } catch (error) {
            console.error("Error en getProximaRonda:", error);
            throw error;
        }
    },
};

export default ApiService;
