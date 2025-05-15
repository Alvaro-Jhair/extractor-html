# API Limpiadora de HTML

Esta es una aplicación simple en Node.js que utiliza la biblioteca Readability de Mozilla para limpiar contenido HTML y extraer información útil de páginas web.

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
```bash
npm install
```

## Uso

1. Inicia el servidor:
```bash
node index.js
```

2. Envía una petición POST a `http://localhost:3000/clean-html` con el siguiente cuerpo JSON:
```json
{
    "html": "<tu contenido HTML aquí>"
}
```

La API devolverá una respuesta JSON con la siguiente estructura:
```json
{
    "title": "Título del artículo",
    "content": "Contenido HTML limpio",
    "textContent": "Contenido en texto plano",
    "excerpt": "Extracto del artículo",
    "byline": "Información del autor",
    "siteName": "Nombre del sitio web"
}
```

## Ejemplo usando curl

```bash
curl -X POST http://localhost:3000/clean-html \
-H "Content-Type: application/json" \
-d '{"html": "<html><body><h1>Artículo de Prueba</h1><p>Algún contenido</p></body></html>"}'
``` 