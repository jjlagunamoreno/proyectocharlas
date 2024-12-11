<template>
  <div class="charlas-container">
    <!-- HEADER -->
    <header class="header">
      <h1>Charlas Tajamar</h1>
      <p class="subtitle">
        Descubre nuestras charlas educativas y eventos destacados
      </p>
    </header>

    <!-- SECCIÓN EVENTOS -->
    <section class="eventos" v-if="eventos.length">
      <h3>Eventos Disponibles</h3>
      <div class="eventos-grid">
        <div
          v-for="evento in eventos"
          :key="evento.idRonda"
          class="evento-card"
        >
          <h4>{{ evento.descripcionModulo }}</h4>
          <p>Duración: {{ evento.duracion }} minutos</p>
          <button @click="fetchCharlasByRonda(evento.idRonda)">
            Ver charlas del {{ formatFecha(evento.fechaPresentacion) }}
          </button>
        </div>
      </div>
    </section>

    <!-- SECCIÓN CHARLAS DISPONIBLES -->
    <section class="proximas-charlas" v-if="charlas.length">
      <h3>Charlas Disponibles</h3>
      <div class="carousel">
        <div
          v-for="charla in visibleCharlas"
          :key="charla.idCharla"
          class="charla-card"
        >
          <img
            :src="
              charla.image || 'https://via.placeholder.com/300x200?text=Charla'
            "
            :alt="charla.titulo"
            class="charla-image"
          />
          <div class="charla-info">
            <h2>{{ charla.titulo }}</h2>
            <p>{{ charla.descripcion }}</p>
            <p class="charla-date">
              📅 {{ formatFecha(charla.fechaPropuesta) }}
            </p>
          </div>
        </div>
      </div>

      <!-- INDICADORES -->
      <div class="carousel-indicators">
        <span
          v-for="(group, index) in totalGroups"
          :key="index"
          class="indicator"
          :class="{ active: index === currentPage }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <p>&copy; 2024 Instituto Tajamar. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script>
import ServiceCharlas from "@/services/ServiceCharlas";
import { format, parseISO } from "date-fns";

export default {
  name: "CharlasTajamar",
  data() {
    return {
      charlas: [], // Lista de charlas obtenidas desde la API
      eventos: [], // Lista de eventos obtenidos desde la API
      currentPage: 0, // Página actual del carrusel
      itemsPerPage: 3, // Número de charlas visibles por página
    };
  },
  computed: {
    visibleCharlas() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.charlas.slice(start, end);
    },
    totalGroups() {
      return Math.ceil(this.charlas.length / this.itemsPerPage); // Número total de grupos
    },
  },
  methods: {
    formatFecha(fecha) {
      return format(parseISO(fecha), "dd/MM/yyyy HH:mm");
    },
    nextSlide() {
      if (this.currentPage + 1 < this.totalGroups) {
        this.currentPage++;
      } else {
        this.currentPage = 0;
      }
    },
    goToSlide(index) {
      this.currentPage = index;
    },
    fetchCharlas() {
      const service = new ServiceCharlas();
      service
        .getCharlas()
        .then((data) => {
          this.charlas = data;
        })
        .catch((error) => {
          console.error("Error al cargar las charlas:", error);
        });
    },
    fetchCharlasByRonda(idRonda) {
      const service = new ServiceCharlas();
      service
        .getCharlasByRonda(idRonda)
        .then((data) => {
          this.charlas = data.sort(
            (a, b) => new Date(a.fechaPropuesta) - new Date(b.fechaPropuesta)
          );
        })
        .catch((error) => {
          console.error("Error al cargar las charlas de la ronda:", error);
        });
    },
    fetchEventos() {
      const service = new ServiceCharlas();
      service
        .getRondas()
        .then((data) => {
          this.eventos = data.sort(
            (a, b) =>
              new Date(a.fechaPresentacion) - new Date(b.fechaPresentacion)
          );
        })
        .catch((error) => {
          console.error("Error al cargar los eventos:", error);
        });
    },
  },
  mounted() {
    this.fetchEventos();
    setInterval(this.nextSlide, 3000); // Cambiar el slide cada 3 segundos
  },
};
</script>

<style scoped>
/* ESTILO GENERAL */
.charlas-container {
  font-family: Arial, sans-serif;
  color: #333;
  padding: 0 1rem;
  max-width: 1200px;
  margin: auto;
}

/* HEADER */
.header {
  text-align: center;
  margin: 2rem 0;
}

.header h1 {
  font-size: 2.5rem;
  color: #003366;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

/* SECCIÓN PRÓXIMAS CHARLAS */
.proximas-charlas {
  margin: 2rem 0;
}

.proximas-charlas h3 {
  text-align: center;
  color: #003366;
}

.carousel {
  display: flex;
  gap: 1rem;
  overflow: hidden;
}

.charla-card {
  flex: 1 1 calc(33.333% - 1rem);
  max-width: calc(33.333% - 1rem);
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.indicator {
  width: 12px;
  height: 12px;
  margin: 0 5px;
  background-color: #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: #003366;
}

/* SECCIÓN EVENTOS */
.eventos {
  margin: 3rem 0;
}

.eventos h3 {
  text-align: center;
  color: #003366;
}

.eventos-grid {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.evento-card {
  background-color: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1 1 calc(50% - 1rem);
}

.evento-card h4 {
  font-size: 1.2rem;
  color: #003366;
}

.evento-card button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.evento-card button:hover {
  background-color: #0056b3;
}

/* FOOTER */
.footer {
  text-align: center;
  margin: 2rem 0;
  font-size: 0.9rem;
  color: #999;
}
</style>
