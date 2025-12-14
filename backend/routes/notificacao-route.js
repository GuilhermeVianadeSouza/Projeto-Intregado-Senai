/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de notificação.
 * Data: 14/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerNotificacao = require('../controllers/notificacao/notificacao-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

// Obtém todas notificações de um cidadão por id
router.get('/cidadao/:id', cors(), async (request, response) => {
    let id = request.params.id
    let notificacoes = await controllerNotificacao.obterNotificacoesPorIdCidadao(id)

    response.status(notificacoes.status_code).json(notificacoes)
})

module.exports = router
