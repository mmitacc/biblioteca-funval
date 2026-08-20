import fs from 'node:fs/promises';
import path from 'node:path';
import type { Sancion } from '../types/sancionestip.js';

export let table_sanciones: Sancion[] = [];

export const cargarSanciones = async (): Promise<void> => {
  try {
    const ruta = path.resolve('src/sanciones.json');
    const datos = await fs.readFile(ruta, 'utf-8');
    table_sanciones = JSON.parse(datos);
    console.log('Sanciones cargadas exitosamente.');
  } catch (error) {
    console.log({ 'Error al cargar sanciones': error });
    table_sanciones = [];
  }
};

export const guardarSanciones = async (): Promise<void> => {
  try {
    const ruta = path.resolve('src/sanciones.json');
    await fs.writeFile(ruta, JSON.stringify(table_sanciones, null, 2), 'utf-8');
  } catch (error) {
    console.log({ 'Error al guardar sanciones': error });
  }
};