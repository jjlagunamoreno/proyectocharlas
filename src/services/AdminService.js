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
    }
}

export default AdminService;