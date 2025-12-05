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
                    MESSAGES.DEFAULT_HEADER.localizacao = resultLocalizacao

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
        if (String(contentType).toLocaleUpperCase() != 'APPLICATION/JSON')
            return MESSAGES.ERROR_CONTENT_TYPE
        let validarInformacoes = await validarDadosLocalizacao(localizacao)
        if (validarInformacoes)
            return validarInformacoes
        let resultLocalizacao = await localizacaoDAO.inserirLocalizacao(localizacao)
        if (!resultLocalizacao)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let ultimoId = await localizacaoDAO.selecionarUltimaLocalizacaoRegistrada()
        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        localizacao.id = ultimoId
        MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana de Souza'
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.items.localizacao = localizacao

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function validarDadosLocalizacao(localizacao) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (localizacao.cep && localizacao.cep.length > 8) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Cep incompleto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (localizacao.estado == undefined || localizacao.estado == null || !isNaN(localizacao.estado) || localizacao.estado == '' || localizacao.estado.length !== 2) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Localização Incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (localizacao.cidade == undefined || localizacao.cidade == null || !isNaN(localizacao.cidade) || localizacao.cidade == '' || localizacao.cidade.length > 120) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Cidade Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (localizacao.bairro == undefined || localizacao.bairro == null || !isNaN(localizacao.bairro) || localizacao.bairro == '' || localizacao.bairro.length > 150) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Bairro Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (localizacao.rua == undefined || localizacao.rua == null || localizacao.rua == '' || localizacao.rua.length > 200 || typeof (localizacao.rua) != 'string') {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Rua Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (localizacao.numero && localizacao.numero.length > 20) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Numero Incompleto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (localizacao.complemento && localizacao.complemento.length > 20) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Complemento Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else {
        return false //não teve erros
    }
}

module.exports = {
    obterLocalizacaoPorId,
    registrarLocalizacao
}
