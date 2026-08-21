import { Router } from "express";
import type { Request, Response } from "express";
import type { Socio, SocioQueryPatch } from "../types/socio.type.js";
import { table_socios } from "../data/socio.js";

const router = Router();

//Get and query por 'suscripto'
router.get('/', (req: Request, res: Response) => {
    // #swagger.tags = ['Socios']
    // #swagger.description = 'Endpoint para listar los socios y consultar por suscripto (true/false)'
    try {
        let socios_Filter: Socio[] = [...table_socios]
        const { suscripto } = req.query;
        const suscriptoMin: string = String(suscripto).toLowerCase();
        if (suscripto !== undefined) {
            if (!['true', 'false'].includes(suscriptoMin)) {
                return res.status(400).json({ error: 'Para <suscripto>, solo se aceptan valores "true" o "false".' })
            }
            const esSuscripto: boolean = suscriptoMin === 'true' ? true : false;
            socios_Filter = socios_Filter.filter(s => s.suscripto === esSuscripto);
        }
        return res.status(200).json({ Todos: socios_Filter.length, Data: socios_Filter })
    } catch (error) {
        const msgError = error instanceof Error ? error.message : 'Error interno desconocido';
        res.status(500).json({ error: msgError });
    }
});

//Get un socio por 'id'
router.get('/:id', (req: Request, res: Response) => {
    // #swagger.tags = ['Socios']
    // #swagger.description = 'Endpoint para buscar a un Socio con su ID'
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id < 0 || !Number.isInteger(id)) {
            return res.status(400).json({ error: `El id = ${req.params.id}, debe ser un numero entero positivo.` })
        }
        const socioSearch = table_socios.find((s) => s.id === id);
        if (!socioSearch) {
            return res.status(400).json({ error: `El Socio con el id=${id}, no existe.` });
        }
        res.status(200).json(socioSearch);
    } catch (error) {
        const msgError = error instanceof Error ? error.message : 'Error interno desconocido';
        res.status(500).json({ error: msgError });
    }
});

//Post un socio con todos sus datos, a excepción del 'id'
router.post('/', (req: Request, res: Response) => {
    // #swagger.tags = ['Socios']
    // #swagger.description = 'Endpoint para registrar un Nuevo Socio'
    try {
        const { nombre, dni, email, suscripto } = req.body;
        // Validando que existan todos los campos requeridos
        if (!nombre || !dni || !email) {
            return res.status(400).json({ error: 'Faltan llenar campos que son requeridos.' })
        }
        // Validando que 'suscripto' sea un valor boolean
        if (typeof suscripto !== 'boolean') {
            return res.status(400).json({ error: 'El campo "suscripto", debe ser de tipo boolean.' })
        }
        // Validando que el 'email' tenga un formato correcto
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'El campo "email", debe tener un formato correcto.' })
        }
        const newProdut: Socio = {
            id: table_socios.length === 0 ? 1 : table_socios.length + 1,
            nombre, dni, email, suscripto
        }
        table_socios.push(newProdut);
        res.status(201).json(newProdut);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
});

// Put para actualizar un socio por 'id'
router.put('/:id', (req: Request<{ id: string }, {}, SocioQueryPatch>, res: Response) => {
    // #swagger.tags = ['Socios']
    // #swagger.description = 'Endpoint para Actualizar '
    try {
        const id: number = Number(req.params.id);
        const index: number = table_socios.findIndex(s => s.id === id);
        if (index === -1) {
            return res.status(404).json({ error: `El Socio con el id = ${id}, no existe.` })
        }
        const currentSocio = table_socios[index]!;
        const { email, suscripto } = req.body;
        // Validar el correcto formato del 'email'
        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'El campo "email", debe tener un formato correcto.' })
            }
        }
        table_socios[index] = {
            id,
            nombre: currentSocio.nombre,
            dni: currentSocio.dni,
            email: email !== undefined ? email : currentSocio?.email,
            suscripto: suscripto !== undefined ? suscripto : currentSocio?.suscripto
        };
        res.status(200).json(table_socios[index]);
    } catch (error) {
        const msgError = error instanceof Error ? error.message : 'Error interno desconocido';
        res.status(500).json({ error: msgError });
    }
});

// Delete de un socio por 'id'
router.delete('/:id', (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        const index: number = table_socios.findIndex(s => s.id === id);
        if (index === -1) {
            return res.status(404).json({ error: `El estudiante con el id = ${id}, no existe.` })
        }
        const [deleteEstudiante] = table_socios.splice(index, 1);
        res.status(200).json(deleteEstudiante);
    } catch (error) {
        const msgError = error instanceof Error ? error.message : 'Error interno desconocido';
        res.status(500).json({ error: msgError });
    }
});

export default router;