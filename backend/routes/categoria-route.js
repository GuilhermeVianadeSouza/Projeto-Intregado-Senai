/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de categoria.
 * Data: 09/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')

const controllerCategoria = require('../controllers/categoria/categoria-controller.js')

// Cria o router que irá guardar as rotas
const router = express.Router()

/********************************** ENDPOINTS *********************************/

router.get('/', cors(), async (request, response) => {
    let categoria = await controllerCategoria.obterTodasCategorias()

    response.status(categoria.status_code).json(categoria)
})

module.exports = router
