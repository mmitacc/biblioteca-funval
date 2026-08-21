import { Router } from 'express';
import type { Request, Response } from 'express';
import { table_sanciones, guardarSanciones } from '../data/sancionesda.js';
import type { Sancion } from '../types/sancionestip.js';
import { table_socios } from '../data/socio.js';

const router = Router();

// GET sancion
router.get('/', (req: Request, res: Response) => {
  const { pagada } = req.query;

  if (pagada !== undefined) {
    const esPagada = pagada === 'true';
    const filtradas = table_sanciones.filter((s) => s.pagado === esPagada);
    return res.json(filtradas);
  }

  return res.json(table_sanciones);
});

// GET sanciones
router.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const sancion = table_sanciones.find((s) => s.id === id);

  if (!sancion) {
    return res.status(404).json({
      error: 'Not Found',
      mensaje: 'No se encontró la sanción con el ID especificado'
    });
  }

  return res.json(sancion);
});

// POST sanciones
router.post('/', async (req: Request, res: Response) => {
  const { socioId, motivo, monto, pagada } = req.body;

  if (monto <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      mensaje: 'El monto de la sanción debe ser mayor a 0'
    });
  }

  if (!socioId || !motivo) {
    return res.status(400).json({
      error: 'Bad Request',
      mensaje: 'Los campos socioId y motivo son obligatorios'
    });
  }

  const nuevaSancion: Sancion = {
    id: table_sanciones.length > 0 ? Math.max(...table_sanciones.map((s) => s.id)) + 1 : 1,
    socioId: Number(socioId),
    motivo,
    monto: Number(monto),
    pagado: Boolean(pagada)
  };

  table_sanciones.push(nuevaSancion);
  await guardarSanciones();

  return res.status(201).json({
    mensaje: 'Sanción registrada exitosamente',
    data: nuevaSancion
  });
});

// PUT sanciones
// router.put('/:id', async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (id < 0 || isNaN(id)) {
//     return res.status(404).json({
//       error: 'Not Found',
//       mensaje: 'No se encontró la sanción a actualizar'
//     });
//   }
//   const index = table_sanciones.findIndex(s => s.id === id);
//   const currentSancion = table_sanciones[index];
//   const { pagado } = req.body;
//   if (!pagado) {
//     return res.status(404).json({
//       error: 'Not Found',
//       mensaje: 'Pagado es un campo obligatorio'
//     });
//   }

//   //   id: number;
//   // socioId: number;
//   // motivo: string;
//   // monto: number;
//   // pagado: boolean;

//   table_sanciones[index] = { pagado: true, ...currentSancion };

//   await guardarSanciones();

//   return res.json({
//     mensaje: 'Sanción actualizada exitosamente',
//     data: table_sanciones[index]
//   });
// });

// DELETE sanciones
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = table_sanciones.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      mensaje: 'Sanción no encontrada para eliminar'
    });
  }

  table_sanciones.splice(index, 1);
  await guardarSanciones();

  return res.json({
    mensaje: `La sanción con ID ${id} ha sido anulada y eliminada correctamente`
  });
});

export default router;