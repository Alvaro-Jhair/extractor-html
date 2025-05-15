const express = require('express');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(express.json({ limit: '2mb' }));

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Promesa rechazada no manejada:', error);
});

app.post('/clean-html', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'Se requiere una URL' });
        }

        // Obtener el contenido HTML de la URL
        const response = await fetch(url);
        const html = await response.text();

        // Crear un documento DOM a partir del HTML
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Crear un nuevo objeto Readability
        const reader = new Readability(doc);

        // Analizar el documento
        const article = reader.parse();

        if (!article) {
            return res.status(400).json({ error: 'No se pudo analizar el contenido HTML' });
        }

        // Formatear la respuesta para mejor legibilidad
        const formattedResponse = {
            metadata: {
                title: article.title || 'Sin título',
                byline: article.byline || 'Sin autor',
                siteName: article.siteName || 'Sin nombre del sitio',
                excerpt: article.excerpt || 'Sin extracto'
            },
            content: {
                html: article.content,
                text: article.textContent
            }
        };

        // Configurar el tipo de contenido y enviar la respuesta formateada
        res.setHeader('Content-Type', 'application/json');
        res.json(formattedResponse);

    } catch (error) {
        console.error('Error al procesar la URL:', error);
        res.status(500).json({ error: 'Error al procesar la URL' });
    }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`El servidor está ejecutándose en el puerto ${PORT}`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
    console.error('Error en el servidor:', error);
}); 