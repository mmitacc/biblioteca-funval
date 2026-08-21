import { Router } from "express";
import fs from "node:fs/promises";
import path from "node:path";

const router = Router();

const archivo = path.join(process.cwd(), "src", "data", "prestamos.json");

interface Prestamo {
  id: number;
  libroId: number;
  socioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string;
  devuelto: boolean;
}

async function leerPrestamos(): Promise<Prestamo[]> {
  const datos = await fs.readFile(archivo, "utf-8");

  return JSON.parse(datos);
}

async function guardarPrestamos(prestamos: Prestamo[]) {
  await fs.writeFile(archivo, JSON.stringify(prestamos, null, 2), "utf-8");
}


router.get("/", async function (req, res) {
  // #swagger.tags = ['Prestamos']
  // #swagger.description = 'Endpoint para listar todos los prestamos '
  try {
    const prestamos = await leerPrestamos();

    const devuelto = req.query.devuelto;

    if (devuelto !== undefined) {
      if (devuelto !== "true" && devuelto !== "false") {
        return res.status(400).json({
          error: "El parámetro devuelto debe ser true o false",
        });
      }

      const resultado = prestamos.filter(function (prestamo) {
        return prestamo.devuelto === (devuelto === "true");
      });

      return res.status(200).json(resultado);
    }

    return res.status(200).json(prestamos);
  } catch (error) {
    return res.status(500).json({
      error: "Error al leer los préstamos",
    });
  }
});


router.get("/:id", async function (req, res) {
  // #swagger.tags = ['Prestamos']
  // #swagger.description = 'Endpoint para mostrar un prestamo por ID '
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número entero positivo",
      });
    }

    const prestamos = await leerPrestamos();

    const prestamo = prestamos.find(function (prestamo) {
      return prestamo.id === id;
    });

    if (!prestamo) {
      return res.status(404).json({
        error: "Préstamo no encontrado",
      });
    }

    return res.status(200).json(prestamo);
  } catch (error) {
    return res.status(500).json({
      error: "Error al buscar el préstamo",
    });
  }
});


router.post("/", async function (req, res) {
  // #swagger.tags = ['Prestamos']
  // #swagger.description = 'Endpoint para registrar un Nuevo Prestamo '
  try {
    const { libroId, socioId, fechaPrestamo, fechaDevolucion, devuelto } =
      req.body;

    if (
      libroId === undefined ||
      socioId === undefined ||
      fechaPrestamo === undefined ||
      fechaDevolucion === undefined ||
      devuelto === undefined
    ) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    if (
      !Number.isInteger(libroId) ||
      !Number.isInteger(socioId) ||
      typeof fechaPrestamo !== "string" ||
      typeof fechaDevolucion !== "string" ||
      typeof devuelto !== "boolean"
    ) {
      return res.status(400).json({
        error: "Los datos enviados tienen tipos inválidos",
      });
    }

    const prestamos = await leerPrestamos();

    let nuevoId = 1;

    if (prestamos.length > 0) {
      nuevoId =
        Math.max(
          ...prestamos.map(function (prestamo) {
            return prestamo.id;
          }),
        ) + 1;
    }

    const nuevoPrestamo: Prestamo = {
      id: nuevoId,
      libroId: libroId,
      socioId: socioId,
      fechaPrestamo: fechaPrestamo,
      fechaDevolucion: fechaDevolucion,
      devuelto: devuelto,
    };

    prestamos.push(nuevoPrestamo);

    await guardarPrestamos(prestamos);

    return res.status(201).json(nuevoPrestamo);
  } catch (error) {
    return res.status(500).json({
      error: "Error al registrar el préstamo",
    });
  }
});


router.put("/:id", async function (req, res) {
  // #swagger.tags = ['Prestamos']
  // #swagger.description = 'Endpoint para Actualizar los datos de un Prestamo por ID '
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número entero positivo",
      });
    }

    const prestamos = await leerPrestamos();

    const posicion = prestamos.findIndex(function (prestamo) {
      return prestamo.id === id;
    });

    if (posicion === -1) {
      return res.status(404).json({
        error: "Préstamo no encontrado",
      });
    }

    const prestamo = prestamos[posicion]!;

    const { fechaDevolucion, devuelto } = req.body;

    if (fechaDevolucion === undefined && devuelto === undefined) {
      return res.status(400).json({
        error: "Debe enviar fechaDevolucion o devuelto",
      });
    }

    if (fechaDevolucion !== undefined && typeof fechaDevolucion !== "string") {
      return res.status(400).json({
        error: "fechaDevolucion debe ser texto",
      });
    }

    if (devuelto !== undefined && typeof devuelto !== "boolean") {
      return res.status(400).json({
        error: "devuelto debe ser boolean",
      });
    }

    if (fechaDevolucion !== undefined) {
      prestamo.fechaDevolucion = fechaDevolucion;
    }

    if (devuelto !== undefined) {
      prestamo.devuelto = devuelto;
    }

    await guardarPrestamos(prestamos);

    return res.status(200).json(prestamo);
  } catch (error) {
    return res.status(500).json({
      error: "Error al actualizar el préstamo",
    });
  }
});


router.delete("/:id", async function (req, res) {
  // #swagger.tags = ['Prestamos']
  // #swagger.description = 'Endpoint para Eliminar el registro de un Prestamo '
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "El ID debe ser un número entero positivo",
      });
    }

    const prestamos = await leerPrestamos();

    const posicion = prestamos.findIndex(function (prestamo) {
      return prestamo.id === id;
    });

    if (posicion === -1) {
      return res.status(404).json({
        error: "Préstamo no encontrado",
      });
    }

    const eliminado = prestamos[posicion]!;

    prestamos.splice(posicion, 1);

    await guardarPrestamos(prestamos);

    return res.status(200).json({
      mensaje: "Préstamo eliminado correctamente",
      prestamo: eliminado,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error al eliminar el préstamo",
    });
  }
});

export default router;
