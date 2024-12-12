# Proyecto React - Gestión de Proyecto con Ramas

Este es un proyecto desarrollado en React, comenzado originalmente en Vue. Está diseñado para ser colaborativo, trabajando en equipo con integración de ramas y una estructura organizada.

## 🛠 Librerías Instaladas

El proyecto utiliza las siguientes librerías para su desarrollo:

- **Axios**: Manejo de peticiones HTTP.  
  `npm install --save axios`
- **Bootstrap**: Estilo y diseño responsivo.  
  `npm install --save bootstrap`
- **React Router DOM**: Navegación entre componentes.  
  `npm install --save react-router-dom`
- **jQuery y Popper.js**: Compatibilidad con Bootstrap.  
  `npm install --save jquery popper.js`

## 📂 Organización del Proyecto

### Rama Principal: `master`
- La rama `master` es la **rama final** donde se realizarán los **merges**.
- Cada integrante del equipo trabaja en su propia rama y, una vez completadas las funcionalidades, hace un merge a `master`.

### Ramas de Trabajo
Cada desarrollador trabajará en su propia rama, por ejemplo:
- `rama-frontend`
- `rama-backend`
- `rama-styles`

Los nombres de las ramas pueden variar según las asignaciones o el área de trabajo.

### Flujo de Trabajo
1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>

Crear una nueva rama:

    git checkout -b nombre-rama

Desarrollar las funcionalidades asignadas.
Hacer commit de los cambios:

    git add .
    git commit -m "Descripción del cambio"

Subir la rama al repositorio:

    git push origin nombre-rama

  Solicitar un merge a master mediante un pull request.

🚀 Iniciar el Proyecto

  Instalar las dependencias:

    npm install

Iniciar el servidor de desarrollo:

    npm start

Accede a la aplicación en: http://localhost:3000

🧑‍💻 Contribuidores

    Integrante 1: Jorge Ruíz Parra (johe)
    Integrante 2: Daniel Rodríguez Lancha (anhi)
    Integrante 3: Jaime Jesús Laguna Moreno (pocajotas)
