import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API de gestion de Biblioteca",
    description: "Documentacion generada automaticamente por swagger-autogen",
    version: "1.0.0",
  },
  host: "localhost:3000",
};
//archivo generado
const outputFile = "./swagger-output.json";

//archivos q seran leidos por swagger-autogen
const routes = ["./src/index.ts"];

swaggerAutogen()(outputFile, routes, doc);
