import Global from "../utils/Global";

const AdminService = {
    GetCursos: async () => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Cursos`, {
                method: "GET",
                headers: {
                    Authorization: Global.token,
                }
            })

            return await response.json();
        } catch (error) {
            console.error(error)
        }
    },

    GetUsuariosCurso: async (idCurso) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Usuarios/UsuariosCurso/${idCurso}`, {
                method: "GET",
                headers: {
                    Authorization: Global.token,
                }
            })

            return await response.json();
        } catch (error) {
            console.error(error)
        }
    },

    GetCursosProfe: async () => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/CursosUsuarios`, {
                method: "GET",
                headers: {
                    Authorization: Global.token,
                }
            })

            return await response.json();
        } catch (error) {
            console.error(error)
        }
    },

    GetInfoCurso: async (idCurso) => {
        try {
            const response = await fetch(`${Global.urlAlumnos}api/Cursos/${idCurso}`, {
                method: "GET",
                headers: {
                    Authorization: Global.token,
                }
            })

            return await response.json();
        } catch (error) {
            console.error(error)
        }
    }
}

export default AdminService;