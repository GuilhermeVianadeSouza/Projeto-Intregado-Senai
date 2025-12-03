/*******************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de cidadao
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import das bibliotecas da API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const categoriaController = require('../controllers/categoria/categoria-controller.js')

const router = express.Router()


/********************************** ENDPOINTS *********************************/

// Obtém todas as ocorrencias

router.get('/', cors(), async (request, response) => {
    let categorias = await categoriaController.obterTodasCategorias()
    console.log(categorias)
    response.status(categorias.status_code).json(categorias)
})

module.exports = router
