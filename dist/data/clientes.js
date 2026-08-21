import fs from "node:fs/promises";
import path from "node:path";
export let table_clientes = [];
export const cargarInventario = async () => {
    try {
        const ruta = path.resolve("src/clientes.json");
        const clientes = await fs.readFile(ruta, "utf-8");
        table_clientes = JSON.parse(clientes);
        console.log("Inventario cargado exitosamente.");
    }
    catch (error) {
        console.log({ "Error al cargar inventario": error });
        table_clientes = [];
    }
};
//# sourceMappingURL=clientes.js.map