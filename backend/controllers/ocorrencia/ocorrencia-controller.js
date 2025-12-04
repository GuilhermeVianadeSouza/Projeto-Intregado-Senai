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
const statusController = require('../../controllers/status/status-controller.js')
const localizacaoController = require('../../controllers/localizacao/localizacao-controller.js')
const categoriaController = require('../../controllers/categoria/categoria-controller.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function obterOcorrencias(limite, pagina) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(limite) || limite == '' || limite == null || limite <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Limite inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        if (isNaN(pagina) || pagina == '' || pagina == null || pagina <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Página inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const ocorrencias = await ocorrenciaDAO.selecionarOcorrenciasRecentes(limite, pagina)

        if (!ocorrencias)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (ocorrencias.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        for (const ocorrencia of ocorrencias) {
            // Adiciona em cada ocorrência o cidadão que a registrou
            const resultadoCidadao = await cidadaoController.obterCidadaoPorIdOcorrencia(ocorrencia.id)
            delete ocorrencia.id_cidadao
            ocorrencia.cidadao = resultadoCidadao.cidadao

            // Adiciona em cada ocorrência o status atual
            const resultadoStatus = await statusController.obterStatusAtualDeUmaOcorrencia(ocorrencia.id)
            ocorrencia.status = resultadoStatus.status

            // Adiciona em cada ocorrência a localização completa
            const resultadoLocalizacao = await localizacaoController.obterLocalizacaoPorId(ocorrencia.id_localizacao)
            delete ocorrencia.id_localizacao
            ocorrencia.localizacao = resultadoLocalizacao.localizacao

            // Adiciona em cada ocorrência a categoria
            const resultadoCategoria = await categoriaController.obterCategoriaPorId(ocorrencia.id_categoria)
            delete ocorrencia.id_categoria
            ocorrencia.categoria = resultadoCategoria.categoria
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
    obterOcorrencias
}
