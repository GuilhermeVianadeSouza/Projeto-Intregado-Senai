/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de notificação que
 *           serão enviados e recebidos entre a model e a route
 * Data: 14/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

const notificacaoDAO = require('../../models/DAO/notificacao.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterNotificacoesPorIdCidadao(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(id) || id == '' || id == null || id <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Id inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const notificacao = await notificacaoDAO.selecionarNotificacoesPorIdCidadao(Number(id))

        if (!notificacao)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (notificacao.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.notificacao = notificacao

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

module.exports = {
    obterNotificacoesPorIdCidadao
}
