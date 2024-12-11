# Charlas Tajamar

**Charlas Tajamar** es una aplicación web desarrollada en Vue.js que permite explorar charlas educativas y eventos destacados del Instituto Tajamar. El proyecto consume una API para obtener información sobre charlas y eventos.

## Características

- **Próximas charlas**: Muestra un carrusel con las charlas más cercanas disponibles.
- **Eventos disponibles**: Lista de eventos con detalles sobre su duración y descripción.
- **Integración con API**: Consume una API externa para obtener datos dinámicos.

## Tecnologías utilizadas

- **Framework**: [Vue.js](https://vuejs.org/)
- **Gestión de dependencias**: [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/)
- **Estilización**: CSS nativo con diseño responsivo.
- **Librerías adicionales**:
  - [Axios](https://axios-http.com/) para realizar llamadas HTTP.
  - [date-fns](https://date-fns.org/) para formateo y manipulación de fechas.

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/proyecto-charlas.git

    Accede al directorio del proyecto:

cd proyecto-charlas

Instala las dependencias:

    npm install

Uso

    Inicia el servidor de desarrollo:

npm run serve

Abre la aplicación en tu navegador:

    http://localhost:8080

Archivos importantes

    src/components/CharlasTajamar.vue: Componente principal para mostrar las charlas y eventos.
    src/services/ServiceCharlas.js: Servicio para manejar las llamadas a la API.

API utilizada

El proyecto consume la API de Charlas de Tajamar para obtener los datos. Consulta la documentación de la API aquí: Documentación de la API
Contribución

Si deseas contribuir al proyecto, sigue estos pasos:

    Haz un fork del repositorio.

    Crea una nueva rama:

git checkout -b nueva-funcionalidad

Realiza tus cambios y haz un commit:

git commit -m "Agrega nueva funcionalidad"

Haz push a tu rama:

    git push origin nueva-funcionalidad

    Abre un Pull Request.

Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más información.
