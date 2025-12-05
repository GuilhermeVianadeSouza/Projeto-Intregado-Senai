/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de ocorrências.
 * Data: 01/12/2025
 * Autor: Nathan, Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const controllerOcorrencia = require('../controllers/ocorrencia/ocorrencia-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Cria uma ocorrência e todas as informações relacionadas a ela
router.post('/', cors(), bodyParserJSON, async (request, response) => {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let ocorrencia = await controllerOcorrencia.registrarOcorrencia(dadosBody, contentType)
    response.status(ocorrencia.status_code).json(ocorrencia)
})

// Obtém ocorrências, permitindo filtros
router.get('', cors(), async (request, response) => {
    const {limite, pagina, categoria, status, dataRegistro, ordenar} = request.query

    let ocorrencias = await controllerOcorrencia.obterOcorrencias(limite, pagina, categoria, status, dataRegistro, ordenar)

    response.status(ocorrencias.status_code).json(ocorrencias)
})

module.exports = router
