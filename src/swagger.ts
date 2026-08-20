import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de gestión de alumnos',
        description: 'Documento generado automaticamente por swagger-autogen',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http']
};

// Archivo generado de salida
const outputFile = './swagger-output.json';
// Archivo cabecera del proyecto para ser leido por swagger-autogen
const routes = ['./index.ts'];

swaggerAutogen()(outputFile, routes, doc);