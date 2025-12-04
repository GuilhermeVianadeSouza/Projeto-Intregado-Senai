/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de historico status
 * Data: 04/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controllerHistorico = require('../controllers/historico_status/historico_status-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

router.post('/', cors(), bodyParserJSON, async (request, response) => {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let historico = await controllerHistorico.registrarHistorico(dadosBody, contentType)
    response.status(historico.status_code).json(historico)
})

module.exports = router
