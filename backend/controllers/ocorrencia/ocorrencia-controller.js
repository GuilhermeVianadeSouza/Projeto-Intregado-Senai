/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de ocorrencia que
 *           serão enviados e recebidos entre a model e a route
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import da model
const ocorrenciaDAO = require('../../models/DAO/ocorrencia.js')

// Import das controllers
const cidadaoController = require('../../controllers/cidadao/cidadao-controller.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterDezOcorrencias() {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        const ocorrencias = await ocorrenciaDAO.selecionarDezOcorrenciasRecentes()

        if (!ocorrencias)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (ocorrencias.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        for (const ocorrencia of ocorrencias) {
            const resultado = await cidadaoController.obterCidadaoPorIdOcorrencia(ocorrencia.id)
            delete ocorrencia.id_cidadao
            ocorrencia.cidadao = resultado.cidadao
        }

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.ocorrencias = ocorrencias

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

module.exports = {
    obterDezOcorrencias
}
