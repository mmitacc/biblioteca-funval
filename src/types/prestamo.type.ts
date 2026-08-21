interface Prestamo {
  id: number;
  libroId: number;
  socioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string | null;
  devuelto: boolean;
}

interface crearPrestamo {
  libroId: number;
  socioId: number;
  fechaPrestamo: string;
  fechaDevolucion?: string | null;
  devuelto: boolean;
}

interface actualizarPrestamo {
  libroId?: number;
  socioId?: number;
  fechaPrestamo?: string;
  fechaDevolucion?: string | null;
  devuelto?: boolean;
}

export type { Prestamo, crearPrestamo, actualizarPrestamo };
