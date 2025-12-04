/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de ocorrencia que
 *           serão enviados e recebidos entre a model e a route
 * Data: 04/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/

const ocorrenciaDAO = require('../../models/DAO/ocorrencia.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function registrarOcorrencia(ocorrencia, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (String(contentType).toLocaleUpperCase() != 'APPLICATION/JSON')
            return MESSAGES.ERROR_CONTENT_TYPE
        let validarInformacoes = await validarDadosOcorrencia(ocorrencia)
        if (validarInformacoes)
            return validarInformacoes
        let resultOcorrencia = await ocorrenciaDAO.registrarOcorrencia(ocorrencia)
        if (!resultOcorrencia)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let ultimoId = await ocorrenciaDAO.selecionarUltimoIdDaOcorrencia()
        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        ocorrencia.id = ultimoId
        MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana de Souza'
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.items.ocorrencia = ocorrencia

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function validarDadosOcorrencia(ocorrencia) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    const dataTeste = new Date(ocorrencia.data_registro)

    if (ocorrencia.descricao == undefined || ocorrencia.descricao == null || !isNaN(ocorrencia.descricao) || ocorrencia.descricao == '' || ocorrencia.descricao.length > 1000) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Descrição incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (ocorrencia.data_registro == undefined || ocorrencia.data_registro == null || ocorrencia.data_registro == '' || isNaN(dataTeste.getTime())) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Data incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (!Number.isInteger(Number(ocorrencia.avaliacao))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Avaliação incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (typeof ocorrencia.compartilhar_dados !== 'boolean') {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Retorno não veio BOOLEAN]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (ocorrencia.id_cidadao == undefined || ocorrencia.id_cidadao == null || isNaN(ocorrencia.id_cidadao) || ocorrencia.id_cidadao == '' || ocorrencia.id_cidadao <= 0 || !Number.isInteger(Number(ocorrencia.id_cidadao))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id do cidadao Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (ocorrencia.id_localizacao == undefined || ocorrencia.id_localizacao == null || isNaN(ocorrencia.id_localizacao) || ocorrencia.id_localizacao == '' || ocorrencia.id_localizacao <= 0 || !Number.isInteger(Number(ocorrencia.id_localizacao))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id da Localizacao Incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (ocorrencia.id_categoria == undefined || ocorrencia.id_categoria == null || isNaN(ocorrencia.id_categoria) || ocorrencia.id_categoria == '' || ocorrencia.id_categoria <= 0 || !Number.isInteger(Number(ocorrencia.id_categoria))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id da Categoria Incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else {
        return false //não teve erros
    }
}

module.exports = {
    registrarOcorrencia
}
