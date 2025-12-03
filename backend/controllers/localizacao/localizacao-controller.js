/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de localizacao que
 *           serão enviados e recebidos entre a model e a route
 * Data: 03/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/


const localizacaoDAO = require('../../models/DAO/localizacao.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterLocalizacaoPorId(id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultLocalizacao = await localizacaoDAO.selecionarLocalizacaoPorID(Number(id))
            if (resultLocalizacao) {
                if (resultLocalizacao.length > 0) {
                    MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana'
                    MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.DEFAULT_HEADER.items.localizacao = resultLocalizacao

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

async function registrarLocalizacao(localizacao, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function validarDadosLocalizacao(localizacao) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (!isNaN(localizacao.cep))
}

module.exports = {
    obterLocalizacaoPorId
}
