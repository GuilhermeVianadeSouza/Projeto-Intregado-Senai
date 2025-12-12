/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de historico status.
 * Data: 11/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controllerOcorrencia = require('../controllers/ocorrencia/ocorrencia-controller.js')
const controllerCategoria = require('../controllers/categoria/categoria-controller.js')
const controllerHistorico = require('../controllers/historico-status/historico-status-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Cria um novo registro de status
router.post('', cors(), bodyParserJSON, async (request, response) => {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let historico = await controllerHistorico.registrarHistorico(dadosBody, contentType)
    response.status(historico.status_code).json(historico)
})

module.exports = router
