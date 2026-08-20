import fs from 'node:fs/promises'
import path from 'node:path'
import type { Socio } from '../types/socio.type.js';

export let table_socios: Socio[] = [];

export const cargarSocios = async () => {
    try {
        const ruta = path.resolve('src/socios.json');
        const socios = await fs.readFile(ruta, 'utf-8');
        table_socios = JSON.parse(socios);
        console.log('Datos de socios cargados exitosamente.');
    } catch (error) {
        console.log({ 'error en servidor': 'No se puedo cargar la data de socios.' });
        table_socios = [];
    }
}
