/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de historico status que
 *           serão enviados e recebidos entre a model e a route
 * Data: 04/12/2025
 * Autor: Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/

const historicoDAO = require('../../models/DAO/historico-status.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function registrarHistorico(historico, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (String(contentType).toLocaleUpperCase() != 'APPLICATION/JSON')
            return MESSAGES.ERROR_CONTENT_TYPE

        let validarInformacoes = await validarDadosHistorico(historico)

        if (validarInformacoes)
            return validarInformacoes

        let resulthistorico = await historicoDAO.inserirHistorico(historico)

        if (!resulthistorico)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let ultimoId = await historicoDAO.selecionarUltimoIdDoHistorico()

        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        historico.id = ultimoId
        MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana de Souza'
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.items.historico = historico

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function iniciarHistorico(ocorrenciaId) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resulthistorico = await historicoDAO.inserirNovoHistorico(Number(ocorrenciaId))

        if (!resulthistorico)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let ultimoId = await historicoDAO.selecionarUltimoIdDoHistorico()

        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        const historico = {
            id: ultimoId,
            data_hora: new Date(),
            id_status: 1,
            id_ocorrencia: ocorrenciaId
        }

        historico.id = ultimoId
        MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana de Souza'
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.historico = historico

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function validarDadosHistorico(historico) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    const dataTeste = new Date(historico.data_hora)
    if (historico.data_hora == undefined || historico.data_hora == null || historico.data_hora == '' || isNaN(dataTeste.getTime())) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Data incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (historico.id_ocorrencia == undefined || historico.id_ocorrencia == null || isNaN(historico.id_ocorrencia) || historico.id_ocorrencia == '' || historico.id_ocorrencia <= 0 || !Number.isInteger(Number(historico.id_ocorrencia))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id da ocorrencia Incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else if (historico.id_status == undefined || historico.id_status == null || isNaN(historico.id_status) || historico.id_status == '' || historico.id_status <= 0 || !Number.isInteger(Number(historico.id_status))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id do Status Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else {
        return false //não teve erros
    }
}

module.exports = {
    registrarHistorico,
    iniciarHistorico
}
