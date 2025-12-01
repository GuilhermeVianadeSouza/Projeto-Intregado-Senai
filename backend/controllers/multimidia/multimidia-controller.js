/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de cidadão que
 *           serão enviados e recebidos entre a model e a route
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import da model
const multimidiaDAO = require('../../models/DAO/multimidia.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterMultimidiaPorIdOcorrencia(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Id inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const multimidia = await multimidiaDAO.selecionarUmaMultimidiaPorIdOcorrencia(Number(id))

        if (!multimidia)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (multimidia.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.multimidia = multimidia

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

module.exports = {
    obterMultimidiaPorIdOcorrencia
}
