/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de localização
 * Data: 03/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerLocalizacao = require('../controllers/localizacao/localizacao-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Obtém uma localização por id
router.get('/:id', cors(), async (request, response) => {
    let id = request.params.id
    let localizacao = await controllerLocalizacao.obterLocalizacaoPorId(id)

    response.status(localizacao.status_code).json(localizacao)
})

module.exports = router
