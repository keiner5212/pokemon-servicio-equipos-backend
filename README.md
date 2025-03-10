# Pokemon Servicio Equipos (Backend)

Un proyecto para gestionar equipos de Pokémon.

## Dependencias (Base)
[Nest](https://docs.nestjs.com/) framework TypeScript starter repository.

## Requisitos
- **[Node.js](https://nodejs.org/)** `>= 16`
- **[pnpm](https://pnpm.io/)** (Administrador de paquetes)
  

## Instalación y Configuración

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/keiner5212/pokemon-servicio-equipos-backend.git
   ```

2. **Instalar dependencias**  
   ```bash
   cd pokemon-servicio-equipos-backend
   pnpm install
   ```

3. **Configurar variables de entorno**  
   ```bash
   cp .env.example .env
   ```

   Ajusta las variables de entorno en el archivo `.env`

   **Nota**: Si quieres trabajar totalmente local, puedes editar la variable `FB_ENVIRONMENT` en el archivo `.env` para establecerlo en `local`, pero ten en cuenta que vas a necesitar ejecutar el emulador de Firebase.  

   Para esto, puedes usar los siguientes pasos:

   - Entra a la carpeta donde está el emulador:
      ```bash
      cd docker/firebase-local
      ```

   - Ejecuta el contenedor:
      ```bash
      docker compose up -d --build
      ```

   - Una vez iniciado el contenedor, puedes acceder a la URL `http://localhost:4000/` para administrar el emulador.

4. **Iniciar el servidor**  
   - Modo desarrollo:
     ```bash
     pnpm dev
     ```
   - Modo producción:
     ```bash
     pnpm start
     ```

## Comandos

- `pnpm run dev` → Inicia el servidor en **modo desarrollo**  
- `pnpm run start` → Ejecuta la aplicación en **modo producción**  
- `pnpm run build` → Construye la aplicación para **producción**  
- `pnpm run lint` → Ejecuta el **linter** para verificar errores de código  
- `pnpm run test` → Ejecuta pruebas unitarias con **Jest**  
- `pnpm run test:watch` → Ejecuta pruebas en modo vigilancia  
- `pnpm run test:cov` → Ejecuta pruebas y genera reporte de cobertura  
- `pnpm run test:e2e` → Ejecuta pruebas de integración (end-to-end)  

---

## **🌍 English Version**

# Pokemon Service Teams (Backend)

A project to manage Pokémon teams.

## Dependencies (Base)
[Nest](https://docs.nestjs.com/) TypeScript starter repository.

## Requirements
- **[Node.js](https://nodejs.org/)** `>= 16`
- **[pnpm](https://pnpm.io/)** (Package manager)
  

## Installation and Configuration

1. **Clone the repository**  
   ```bash
   git clone https://github.com/keiner5212/pokemon-servicio-equipos-backend.git
   ```

2. **Install dependencies**  
   ```bash
   cd pokemon-servicio-equipos-backend
   pnpm install
   ```

3. **Configure environment variables**  
   ```bash
   cp .env.example .env
   ```

   Adjust the environment variables in the `.env` file.

   **Note**: If you want to work fully locally, you can set the `FB_ENVIRONMENT` variable in the `.env` file to `local`, but you will need to run the Firebase emulator.  

   Follow these steps:

   - Go to the emulator directory:
      ```bash
      cd docker/firebase-local
      ```

   - Start the container:
      ```bash
      docker compose up -d --build
      ```

   - Once the container is running, access `http://localhost:4000/` to manage the emulator.

4. **Start the server**  
   - Development mode:
     ```bash
     pnpm dev
     ```
   - Production mode:
     ```bash
     pnpm start
     ```

## Commands

- `pnpm run dev` → Start the server in **development mode**  
- `pnpm run start` → Run the application in **production mode**  
- `pnpm run build` → Build the application for **production**  
- `pnpm run lint` → Run the **linter** to check code errors  
- `pnpm run test` → Run unit tests with **Jest**  
- `pnpm run test:watch` → Run tests in watch mode  
- `pnpm run test:cov` → Run tests and generate coverage report  
- `pnpm run test:e2e` → Run integration tests (end-to-end)  