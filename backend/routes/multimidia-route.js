/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de multimidia
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerMultimidia = require('../controllers/multimidia/multimidia-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Obtém uma multimidia pelo id de uma ocorrencia
router.get('/multimidia/:id', cors(), async (request, response) => {
    let idOcorrencia = request.params.id
    let multimidia = await controllerMultimidia.obterMultimidiaPorIdOcorrencia(idOcorrencia)

    response.status(multimidia.status_code).json(multimidia)
})

module.exports = router
