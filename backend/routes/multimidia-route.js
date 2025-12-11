/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de multimidia.
 * Data: 11/12/2025
 * Autor: Victor Hugo
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerMultimidia = require('../controllers/multimidia/multimidia-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Retorna as multimídias de uma ocorrência
router.get('/ocorrencia/:id', cors(), async (request, response) => {
    let idOcorrencia = request.params.id
    let multimidia = await controllerMultimidia.obterMultimidiaPorIdOcorrencia(idOcorrencia)

    response.status(multimidia.status_code).json(multimidia)
})


module.exports = router
