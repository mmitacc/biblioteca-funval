import fs from "node:fs/promises";
import path from "node:path";
import type { libro } from "../types/libro.type.js";

export let listaLibros: libro[] = [];

export async function cargarDatosLibro() {
  try {
    const ruta = path.resolve("src/libro.json");
    const data = await fs.readFile(ruta, "utf-8");
    listaLibros = JSON.parse(data);
    console.log(
      `DATOS CARGADOS EN MEMORIA: ${listaLibros.length} Libros cargados`,
    );
  } catch (error) {
    console.log("No se encontraron libros en la lista o lista vacia");
    listaLibros = [];
  }
}

export function setListaLibros(nuevaLista: libro[]) {
  listaLibros = nuevaLista;
}
