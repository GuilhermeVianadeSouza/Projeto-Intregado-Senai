/*******************************************************************************
 * Objetivo: Arquivo responsável pela centralização das configurações do express
 *           e rotas da API.
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

// Import das configurações do Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./swagger-config.js')

// cria uma instância do express para utilizar a API
const app = express()

const porta = process.PORT || 8080

// Configurações do cors
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

// Import de routes
const ocorrenciaRoutes = require('./routes/ocorrencia-route.js')
const cidadaoRoutes = require('./routes/cidadao-route.js')
const localizacaoRoutes = require('./routes/localizacao-route.js')
const categoriaRoutes = require('./routes/categoria-route.js')

// Utilização das rotas
app.use('/v1/ocorrencia', ocorrenciaRoutes)
app.use('/v1/cidadao', cidadaoRoutes)
app.use('/v1/localizacao', localizacaoRoutes)
app.use('/v1/categoria', categoriaRoutes)

app.listen(porta, () => {
    console.log(`API aguardando requisições na porta ${porta}!`)
    console.log(`Documentação disponível em http://localhost:${porta}/v1/api-docs`)
})
