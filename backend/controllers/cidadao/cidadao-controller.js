/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de cidadão que
 *           serão enviados e recebidos entre a model e a route
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import da model
const cidadaoDAO = require('../../models/DAO/cidadao.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterCidadaoPorId(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Id inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const cidadao = await cidadaoDAO.selecionarCidadaoPorId(Number(id))

        delete cidadao[0].senha

        if (!cidadao)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (cidadao.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.cidadao = cidadao

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

async function obterCidadaoPorIdOcorrencia(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Id inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const cidadao = await cidadaoDAO.selecionarCidadaoPorIdOcorrencia(Number(id))

        for (const c of cidadao) {
            delete c.senha
        }

        if (!cidadao)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (cidadao.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.cidadao = cidadao

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

module.exports = {
    obterCidadaoPorId,
    obterCidadaoPorIdOcorrencia
}
