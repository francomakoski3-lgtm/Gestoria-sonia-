# Gestoria Sonia - sitio con panel administrativo

## Requisitos

- Node.js 24 o superior.

## Como iniciar

1. Abre una terminal en esta carpeta.
2. Ejecuta:

```bash
npm start
```

3. Abre [http://localhost:3000](http://localhost:3000)
4. Para entrar al panel abre [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

## Credenciales iniciales

- Usuario: `admin`
- Clave inicial: `admin1234`

La cuenta inicial se crea solo la primera vez. Despues puedes cambiar la clave desde la pestana `Cuenta` del panel.

## Que incluye

- Login con sesion para el panel.
- Base de datos SQLite local en `data/gestoria-sonia.db`.
- CRUD de autos e inmuebles.
- Carga de portada y galeria de imagenes desde el panel.
- Paginas publicas conectadas directamente a la base de datos.

## Archivos principales

- `server.js`: servidor HTTP, autenticacion y API.
- `admin.html`: panel administrativo.
- `js/admin.js`: logica del panel.
- `js/site.js`: logica publica del sitio.
