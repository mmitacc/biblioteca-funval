interface libro {
  id: Number;
  titulo: string;
  autor: string;
  categoria: string;
  stock: Number;
  disponible: boolean;
}
interface crearLibro {
  titulo: string;
  autor: string;
  categoria: string;
  stock: Number;
}
interface actualizarLibro {
  titulo: string;
  autor: string;
  categoria: string;
  stock: Number;
  disponible: boolean;
}
interface librosFiltrados {
  titulo?: string;
  autor?: string;
  categoria?: string;
  disponible?: string;
}

interface idParam {
  id: string;
}

export type { libro, crearLibro, actualizarLibro, librosFiltrados, idParam };
