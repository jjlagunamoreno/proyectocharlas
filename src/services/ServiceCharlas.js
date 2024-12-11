import axios from "axios";

const API_URL = "https://apicharlasalumnostajamar.azurewebsites.net/api/";

export default class ServiceCharlas {
    // OBTENER TODAS LAS CHARLAS
    getCharlas() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${API_URL}Charlas`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    // OBTENER TODAS LAS RONDAS
    getRondas() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${API_URL}Rondas`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    // OBTENER CHARLAS POR RONDA
    getCharlasByRonda(idRonda) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${API_URL}Charlas/CharlasRonda/${idRonda}`)
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }
}
