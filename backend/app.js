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
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// cria uma instância do express para utilizar a API
const app = express()

const porta = process.PORT || 8080

// Carrega o arquivo YAML
const swaggerDocument = YAML.load('./openapi.yaml');

// Rota para acessar o Swagger como página
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
const historicoStatusRoutes = require('./routes/historico-status-route.js')

// Utilização das rotas
app.use('/v1/ocorrencia', ocorrenciaRoutes)
app.use('/v1/cidadao', cidadaoRoutes)
app.use('/v1/localizacao', localizacaoRoutes)
app.use('/v1/categoria', categoriaRoutes)
app.use('/v1/historico-status', historicoStatusRoutes)

app.listen(porta, () => {
    console.log(`API aguardando requisições na porta ${porta}!`)
    console.log("Swagger disponível em: http://localhost:8080/docs");
})
