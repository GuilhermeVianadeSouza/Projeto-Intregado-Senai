/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de ocorrencias
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerOcorrencias = require('../controllers/ocorrencia/ocorrencia-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Obtém 10 ocorrências recentes
router.get('', cors(), async (request, response) => {
    let ocorrencias = await controllerOcorrencias.obterDezOcorrencias()

    response.status(ocorrencias.status_code).json(ocorrencias)
})

module.exports = router
