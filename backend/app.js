/*******************************************************************************
 * Objetivo: Arquivo responsável pela centralização das configurações do express
 *           e rotas da API
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

// cria uma instância do express para utilizar a API
const app = express()

const porta = process.PORT || 8080

// Configurações do cors
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    app.use(cors())
    next()
})

// Import de routes
const cidadaoRoutes = require('./routes/cidadao-route.js')
const multimidiaRoutes = require('./routes/multimidia-route.js')
const localizacaoRoutes = require('./routes/localizacao-routes.js')
const statusRoutes = require('./routes/status-route.js')

// Utilização das rotas
app.use('/v1/cidadao', cidadaoRoutes)
app.use('/v1/ocorrencia', multimidiaRoutes)
app.use('/v1/ocorrencia', localizacaoRoutes)
app.use('/v1/status', statusRoutes)

app.listen(porta, () => {
    console.log(`API aguardando requisições na porta ${porta}!`)
})
