import Global from "../utils/Global";

const ApiService = {
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

            // Guardar token en localStorage
            localStorage.setItem("token", "Bearer " + data.response);

            // Devolver el rol y el token
            return { token: data.response, role: data.role };
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("token");
    },

    logout: () => {
        localStorage.removeItem("token");
    },
};

export default ApiService;
