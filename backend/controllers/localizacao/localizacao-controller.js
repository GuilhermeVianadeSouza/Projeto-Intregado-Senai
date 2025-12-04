/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de localização que
 *           serão utilizados na controller de ocorrência
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import da model
const localizacaoDAO = require('../../models/DAO/localizacao.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterLocalizacaoPorId(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Id inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const localizacao = await localizacaoDAO.selecionarLocalizacaoPorId(Number(id))

        if (!localizacao)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (localizacao.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.localizacao = localizacao

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

module.exports = {
    obterLocalizacaoPorId
}
