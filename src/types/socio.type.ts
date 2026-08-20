export interface Socio {
    id: number;
    nombre: string;
    dni: string;
    email: string;
    suscripto: boolean;
};

export type SocioQueryPatch = Partial<Omit<Socio, 'id'>>;