/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de categoria que
 *           serão enviados e recebidos entre a model e a route
 * Data: 03/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/

const categoriaDAO = require('../../models/DAO/categoria.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterTodasCategorias() {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        const resultCategorias = await categoriaDAO.selecionarTodasAsCategorias()
        if (resultCategorias) {
            if (resultCategorias.length > 0) {
                MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana'
                MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.DEFAULT_HEADER.items.categorias = resultCategorias

                return MESSAGES.DEFAULT_HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // ERRO 500 CONTROLLER
    }
}

async function obterCategoriaPorId(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultCategorias = await categoriaDAO.selecionarCategoriaPorID(Number(id))
            if (resultCategorias) {
                if (resultCategorias.length > 0) {
                    MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana'
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.categorias = resultCategorias

                    return MESSAGES.DEFAULT_HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // ERRO 500 CONTROLLER
    }
}

module.exports = {
    obterTodasCategorias,
    obterCategoriaPorId
}
