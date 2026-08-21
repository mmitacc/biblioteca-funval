import fs from "node:fs/promises";
import path from "node:path";
import type { Cliente } from "../types/cliente.type.js";

export let table_clientes: Cliente[] = [];

export const cargarInventario = async () => {
  try {
    const ruta = path.resolve("src/clientes.json");
    const clientes = await fs.readFile(ruta, "utf-8");
    table_clientes = JSON.parse(clientes);
    console.log("Inventario cargado exitosamente.");
  } catch (error) {
    console.log({ "Error al cargar inventario": error });
    table_clientes = [];
  }
};
