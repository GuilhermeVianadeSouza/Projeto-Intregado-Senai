/*******************************************************************************
 * Objetivo: Arquivo responsável pela configuração do Swagger.
 * Data: 08/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

const swaggerJSDoc = require('swagger-jsdoc')

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'Repórter do meu bairro - Projeto integrado do SENAI',
      version: '1.0.0',
      description: 'API Destinada ao controle de ocorrências registradas por cidadãos',
      termsOfService: 'http://swagger.io/terms/',
    },
    servers: [{ url: 'http://localhost:8080' }],
  },
  apis: ['./routes/*.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions)

module.exports = swaggerDocs
