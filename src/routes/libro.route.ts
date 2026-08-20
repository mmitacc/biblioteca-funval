import { Router } from "express";
import type { Request, Response } from "express";
import { listaLibros, setListaLibros } from "../data/libro.js";

import type {
  libro,
  crearLibro,
  actualizarLibro,
  librosFiltrados,
  idParam,
} from "../types/libro.type.js";

const router = Router();

router.get(
  "/",
  function (req: Request<{}, {}, {}, librosFiltrados>, res: Response) {
    // #swagger.tags = ['Libros']
    // #swagger.description = 'Obtiene la lista de estudiantes con filtros opcionales'

    /*  #swagger.parameters['titulo'] = {
            in: 'query',
            description: 'Filtrar por titulo (insensible a mayúsculas)',
            type: 'string'
    } */
    /*  #swagger.parameters['autor'] = {
            in: 'query',
            description: 'Filtrar por Autor exacto',
            type: 'string'
    } */
    /*  #swagger.parameters['Categoria'] = {
            in: 'query',
            description: 'fintrar por categoria',
            type: 'string'
    } */
    /*  #swagger.parameters['disponible'] = {
            in: 'query',
            description: 'Disponibilidad del Libro (true o false)',
            type: 'string'
    } */

    const { titulo, autor, categoria, disponible } = req.query;
    let resultado = [...listaLibros];

    //FILTRO PARA EL Titulo mayusculas y minusculas irrelevantes
    if (titulo) {
      resultado = resultado.filter(
        (l) => l.titulo.toLowerCase() === titulo.toLowerCase(),
      );
    }
    //filtro POR EL Autor indiferente a si esta minusculas o mayusculas
    if (autor) {
      resultado = resultado.filter(
        (l) => l.autor.toLowerCase() === autor.toLowerCase(),
      );
    }

    //filtro POR EL Categoria indiferente a si esta minusculas o mayusculas
    if (categoria) {
      resultado = resultado.filter(
        (l) => l.categoria.toLowerCase() === categoria.toLowerCase(),
      );
    }
    //filtro por edad minima
    /* if (minstock) {
      const stockNumerico = Number(minstock);
      if (isNaN(stockNumerico)) {
        return res.json({ error: "El Stock debe ser un numero" });
      }
      resultado = resultado.filter((l) => l.stock >= stockNumerico);
    } */
    //filtro para la disponibilidad del libro
    if (disponible) {
      if (
        disponible.toLowerCase() !== "true" &&
        disponible.toLowerCase() !== "false"
      ) {
        return res.json({ error: "el estado activo debe ser true o false" });
      }
      const esActivo = disponible.toLowerCase() === "true";
      resultado = resultado.filter((l) => l.disponible === esActivo);
    }

    // mostrar el resultado filtrado
    return res.json({
      total: resultado.length,
      datos: resultado,
    });
  },
);

//endpoint para traer a a un Libro especifico x su id

router.get("/:id", function (req: Request<idParam>, res: Response) {
  // #swagger.tags = ['Libros']
  // #swagger.description = 'Obtiene la informacion de un libro buscando por si ID'
  /*  #swagger.parameters['id'] = {
          in: 'path',
          description: 'ID del libro a buscar',
          required: true,
          type: 'integer'
  } */
  const idBuscado = Number(req.params.id); //Number("juan") === 32

  if (isNaN(idBuscado)) {
    return res
      .status(400)
      .json({ error: "El parametro id debe ser un numero valido" });
  }
  const libroFiltrado = listaLibros.find((e) => e.id === idBuscado);

  if (!libroFiltrado) {
    return res.status(404).json({ error: "no existe un Libro con ese ID" });
  }
  return res.json(libroFiltrado);
});

//CREAR UN ESTUDIANTE NUEVO METODO POST

router.post("/", function (req: Request<{}, {}, crearLibro>, res: Response) {
  /*
      #swagger.tags = ['Libros']
      #swagger.summary = 'crear un Libro nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un Libro nuevo',
        required: true,
        schema: {
          $titulo: "Libro de Mormon",
          $autor: "Jesus",
          $categoria: "Ficcion",
          &stock: 10
        }
      }
    */
  const { titulo, autor, categoria, stock } = req.body;
  if (!titulo || !autor || !categoria || !stock) {
    return res.status(400).json({ error: "faltan datos q son obligatorios" });
  }
  const nuevoLibro: libro = {
    id: listaLibros.length > 0 ? listaLibros.length + 1 : 1,
    titulo,
    autor,
    categoria,
    stock,
    disponible: true,
  };
  listaLibros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

//endpoint para actualizar un libro
router.put("/:id", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Libros']
    #swagger.summary = 'actualizar un Libro existente'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del libro a actualizar',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos a actualizar del estudiante',
      required: true,
      schema: {
        titulo: "La Llorona",
        autor: "Miguel de Cervantes",
        categoria: "Romance",
        stock: 10,
        disponible: true
      }
    }
  */
  const idBuscado = Number(req.params.id);
  const index = listaLibros.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res.status(404).json({ error: "Libro no encontrado !!" });
  } else {
    const { titulo, autor, categoria, stock, disponible }: actualizarLibro =
      req.body;
    // actualizando la informacion del usuario
    listaLibros[index] = {
      id: idBuscado,
      titulo: titulo ?? listaLibros[index]?.titulo,
      autor: autor ?? listaLibros[index]?.autor,
      categoria: categoria ?? listaLibros[index]?.categoria,
      stock: stock ?? listaLibros[index]?.stock,
      disponible: disponible ?? listaLibros[index]?.disponible,
    };
    res.json(listaLibros[index]);
  }
});

// delete ELIMINACION DE UN REGISTRO :C
router.delete("/:id", function (req: Request, res: Response) {
  /*
    #swagger.tags = ['Libros']
    #swagger.summary = 'eliminar un Libro'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del libro a eliminar',
      required: true,
      type: 'integer'
    }
  */
  const idBuscado = Number(req.params.id);
  const index = listaLibros.findIndex(function (e) {
    return e.id === idBuscado;
  });
  if (index === -1) {
    return res
      .status(404)
      .json({ error: "Libro no encontrado no podemos eliminarlo" });
  } else {
    let Listanueva = listaLibros.filter((e) => e.id !== idBuscado);
    setListaLibros(Listanueva);
    res.json({ mensaje: "LIBRO ELIMINADO EXITOSAMENTE" });
  }
});

export default router;
