/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de cidadão.
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerCidadao = require('../controllers/cidadao/cidadao-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Obtém o id de um cidadão a partir do email dele
router.get('/email/:email', cors(), async (request, response) => {
    const email = request.params.email
    const cidadao = await controllerCidadao.obterIdDoCidadaoPorEmail(email)

    response.status(cidadao.status_code).json(cidadao)
})

// Obtém um cidadão por id
router.get('/:id', cors(), async (request, response) => {
    let idCidadao = request.params.id
    let cidadao = await controllerCidadao.obterCidadaoPorId(idCidadao)

    response.status(cidadao.status_code).json(cidadao)
})

// Obtém um cidadão por id da ocorrência
router.get('/ocorrencia/:id', cors(), async (request, response) => {
    let idOcorrencia = request.params.id
    let cidadao = await controllerCidadao.obterCidadaoPorIdOcorrencia(idOcorrencia)

    response.status(cidadao.status_code).json(cidadao)
})

module.exports = router
