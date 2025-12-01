/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de status
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerStatus = require('../controllers/status/status-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Obtém o status atual de uma ocorrência
router.get('/ocorrencia/:id', cors(), async (request, response) => {
    let idOcorrencia = request.params.id
    let status = await controllerStatus.obterStatusAtualDeUmaOcorrencia(idOcorrencia)

    response.status(status.status_code).json(status)
})

module.exports = router
