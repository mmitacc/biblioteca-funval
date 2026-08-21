import routerPrestamos from './routes/prestamos.routes.js';
import { cargarSocios } from './data/socio.js';
import routerSocios from './routes/socios.route.js';
import routerLibros from './routes/libro.route.js';
import routerSanciones from './routes/sancionesrou.js'
import express from "express";
import { cargarDatosLibro } from "./data/libro.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import { cargarSanciones } from './data/sancionesda.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors());

const swaggerFilePath = path.resolve("./src/swagger-output.json");
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Archivo swagger cargado, exitosamente!");
} else {
  console.log("Archivo swagger json, no encontrado");
}

app.use("/prestamos", routerPrestamos);
app.use('/libros', routerLibros);
app.use('/socios', routerSocios);
app.use('/sanciones', routerSanciones);

//============ ENCENDIENDO EL SERVER ================
app.listen(PORT, async () => {
  try {
    // console.clear();
    await cargarDatosLibro()
    await cargarSanciones()
    await cargarSocios()

    console.log(`Sevidor corriendo en: http://localhost:${PORT}`);
  } catch (error) {
    console.log({ Error: error });
  }
});
//===================================================
