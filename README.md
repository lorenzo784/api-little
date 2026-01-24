# ExpressJS + Vite + React 

Este repositorio contiene una aplicacion con un backend en ExpressJS y un frontend en React (Vite).

## Requisitos Previos

-   [Node.js](https://nodejs.org/) (v18 o superior recomendado)
-   [pnpm](https://pnpm.io/installation) (Gestor de paquetes utilizado en este proyecto)

## Instalación

1.  Clona el repositorio:

    ```bash
    git clone ...
    cd expressjs-vite-react
    ```

2.  Instala las dependencias del proyecto raíz y de los workspaces:

    ```bash
    pnpm install
    ```

3.  Generar el cliente de prisma:

    ```bash
    cd server
    pnpm prisma generate
    ```

## Configuración del Entorno

### Backend (Server)

1.  Ve al directorio del servidor:

    ```bash
    cd server
    ```

2.  Copia el archivo de ejemplo de variables de entorno:

    ```bash
    cp .env.example .env
    ```

## Ejecución

### Desarrollo

Para correr tanto el servidor como el cliente en modo desarrollo simultáneamente:

```bash
pnpm dev
```

Esto ejecutará:
-   **Server:** http://localhost:3000
-   **Client:** http://localhost:5173

### Producción

Para construir y correr la aplicación:

1.  Construir (Build):

    ```bash
    pnpm build
    ```

2.  Iniciar solo el servidor (producción):

    ```bash
    pnpm start
    ```

    ```bash
    pnpm dev
    ```

## Estructura del Proyecto

-   `client/`: Frontend (Vite, React, TailwindCSS, DaisyUI)
-   `server/`: Backend (Express, Prisma, SQL Server)
