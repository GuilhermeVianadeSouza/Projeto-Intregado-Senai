/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de multimidia que
 *           serão utilizados na controller de ocorrência
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

async function inserirMultimidia(multimidia, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (String(contentType).toLocaleUpperCase() != 'APPLICATION/JSON')
            return MESSAGES.ERROR_CONTENT_TYPE

        let validarInformacoes = await validarDadosMultimidia(multimidia)

        if (validarInformacoes)
            return validarInformacoes

        let resultMultimidia = await multimidiaDAO.registrarUmaMultimidia(multimidia)

        if (!resultMultimidia)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let ultimoId = await multimidiaDAO.selecionarUltimoIdMultimidia()
        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        multimidia.id = ultimoId
        MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana de Souza'
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.items.multimidia = multimidia

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500 - Controller
    }
}


async function validarDadosMultimidia(multimidia) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (multimidia.link == undefined || multimidia.link == null || !isNaN(multimidia.link) || multimidia.link == '' || multimidia.link.length > 256) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Link Incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (multimidia.id_ocorrencia == undefined || multimidia.id_ocorrencia == null || isNaN(multimidia.id_ocorrencia) || multimidia.id_ocorrencia == '' || multimidia.id_ocorrencia <= 0 || !Number.isInteger(Number(multimidia.id_ocorrencia))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id da ocorrencia Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else {
        return false //não teve erros
    }
}

module.exports = {
    obterMultimidiaPorIdOcorrencia,
    inserirMultimidia
}
