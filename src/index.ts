import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { cargarSocios } from './data/socio.js';
import { cargarDatosLibro } from "./data/libro.js";
import routerSocios from './routes/socios.route.js';
import routerLibros from './routes/libro.route.js';
import routerSanciones from './routes/sancionesrou.js'

const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerFilePath = path.resolve('./src/swagger-output.json');
if (fs.existsSync(swaggerFilePath)) {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Archivo swagger cargado, exitosamente!');
} else {
    console.log('Archivo swagger json, no encontrado');
}

app.use('/libros', routerLibros);
app.use('/socios', routerSocios);
// app.use('/sanciones', routerSanciones);

//============ ENCENDIENDO EL SERVER ================
app.listen(PORT, async () => {
    try {
        // console.clear();
        await cargarSocios();  // Cargando la data del 'Socios'
        await cargarDatosLibro(); // Cargando la data del 'inventario' desde el arranque del servidor
        console.log(`Sevidor corriendo en: http//localhost:${PORT}`);
    } catch (error) {
        console.log({ 'Error': error });
    }
})
//===================================================
