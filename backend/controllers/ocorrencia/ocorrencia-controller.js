/*******************************************************************************
 * Objetivo: Arquivo responsável pela manipulação dos dados de ocorrencia que
 *           serão enviados e recebidos entre a model e a route.
 * Data: 01/12/2025
 * Autor: Nathan, Guilherme Viana de Souza
 * Versão: 1.0
 ******************************************************************************/

const ocorrenciaDAO = require('../../models/DAO/ocorrencia.js')

// Import das controllers
const cidadaoController = require('../../controllers/cidadao/cidadao-controller.js')
const statusController = require('../../controllers/status/status-controller.js')
const localizacaoController = require('../../controllers/localizacao/localizacao-controller.js')
const categoriaController = require('../../controllers/categoria/categoria-controller.js')
const multimidiaController = require('../../controllers/multimidia/multimidia-controller.js')
const historicoStatusController = require('../../controllers/historico-status/historico-status-controller.js')

const DEFAULT_MESSAGES = require('../modulo/config-messages.js')

async function registrarOcorrencia(ocorrencia, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    try {
        if (String(contentType).toLocaleUpperCase() != 'APPLICATION/JSON')
            return MESSAGES.ERROR_CONTENT_TYPE

        const validarInformacoes = await validarDadosOcorrencia(ocorrencia)
        if (validarInformacoes)
            return validarInformacoes

        const resultLocalizacao = await localizacaoController.registrarLocalizacao(ocorrencia.localizacao, contentType)
        if (resultLocalizacao.status_code != 201)
            return resultLocalizacao

        const localizacaoId = resultLocalizacao.localizacao.id

        ocorrencia.id_localizacao = localizacaoId

        const resultCategoria = await categoriaController.obterCategoriaPorId(ocorrencia.id_categoria)
        if (resultCategoria.status_code != 200)
            return resultCategoria

        const resultOcorrencia = await ocorrenciaDAO.registrarOcorrencia(ocorrencia)
        if (!resultOcorrencia)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        const ultimoId = await ocorrenciaDAO.selecionarUltimoIdDaOcorrencia()
        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        const resultStatus = await historicoStatusController.iniciarHistorico(ultimoId)
        if (resultStatus.status_code != 201)
            return resultStatus

        for (const multimidia of ocorrencia.multimidia) {
            multimidia.id_ocorrencia = ultimoId
            const resultMultimidia = await multimidiaController.inserirMultimidia(multimidia, contentType)
            if (resultMultimidia.status_code != 201)
                return resultMultimidia
        }

        ocorrencia.id = ultimoId
        MESSAGES.DEFAULT_HEADER.development = 'Guilherme Viana de Souza, Nathan'
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.ocorrencia = ocorrencia

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function obterOcorrencias(
    limite, pagina, categoria, status, dataRegistro, ordenar = 'DESC'
) {
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

        const ocorrencias = await ocorrenciaDAO.selecionarOcorrencias(limite, pagina, categoria, status, dataRegistro, ordenar)

        if (!ocorrencias)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (ocorrencias.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        // Adiciona informações em cada uma das ocorrências
        for (const ocorrencia of ocorrencias) {
            // Cidadão que a registrou
            const resultadoCidadao = await cidadaoController.obterCidadaoPorIdOcorrencia(ocorrencia.id)
            delete ocorrencia.id_cidadao
            ocorrencia.cidadao = resultadoCidadao.cidadao

            // Status atual
            const resultadoStatus = await statusController.obterStatusAtualDeUmaOcorrencia(ocorrencia.id)
            ocorrencia.status = resultadoStatus.status

            // Localização
            const resultadoLocalizacao = await localizacaoController.obterLocalizacaoPorId(ocorrencia.id_localizacao)
            delete ocorrencia.id_localizacao
            ocorrencia.localizacao = resultadoLocalizacao.localizacao

            // Categoria
            const resultadoCategoria = await categoriaController.obterCategoriaPorId(ocorrencia.id_categoria)
            delete ocorrencia.id_categoria
            ocorrencia.categoria = resultadoCategoria.categorias

            // Uma multimidia
            const resultadoMultimidia = await multimidiaController.obterMultimidiaPorIdOcorrencia(ocorrencia.id)
            ocorrencia.multimidia = resultadoMultimidia.multimidia
        }

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.ocorrencias = ocorrencias

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

async function obterOcorrenciasDeUmCidadao(cidadaoId) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (isNaN(cidadaoId) || cidadaoId == '' || cidadaoId == null || cidadaoId <= 0) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Id do cidadão inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - Campos obrigatórios
        }

        const ocorrencias = await ocorrenciaDAO.selecionarOcorrenciasCidadao(Number(cidadaoId))

        if (!ocorrencias)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500 - Model

        if (ocorrencias.length <= 0)
            return MESSAGES.ERROR_NOT_FOUND // 404 - Não encontrado

        // Adiciona informações em cada uma das ocorrências
        for (const ocorrencia of ocorrencias) {
            // Status atual
            const resultadoStatus = await statusController.obterStatusAtualDeUmaOcorrencia(ocorrencia.id)
            ocorrencia.status = resultadoStatus.status

            // Localização
            const resultadoLocalizacao = await localizacaoController.obterLocalizacaoPorId(ocorrencia.id_localizacao)
            delete ocorrencia.id_localizacao
            ocorrencia.localizacao = resultadoLocalizacao.localizacao

            // Categoria
            const resultadoCategoria = await categoriaController.obterCategoriaPorId(ocorrencia.id_categoria)
            delete ocorrencia.id_categoria
            ocorrencia.categoria = resultadoCategoria.categorias

            // Uma multimidia
            const resultadoMultimidia = await multimidiaController.obterMultimidiaPorIdOcorrencia(ocorrencia.id)
            ocorrencia.multimidia = resultadoMultimidia.multimidia
        }

        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_REQUEST.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
        MESSAGES.DEFAULT_HEADER.ocorrencias = ocorrencias

        return MESSAGES.DEFAULT_HEADER

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER // 500 - Controller
    }
}

async function validarDadosOcorrencia(ocorrencia) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if (ocorrencia.descricao == undefined || ocorrencia.descricao == null || !isNaN(ocorrencia.descricao) || ocorrencia.descricao == '' || ocorrencia.descricao.length > 1000) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Descrição incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (!Number.isInteger(Number(ocorrencia.avaliacao)) || ocorrencia.avaliacao > 5 || ocorrencia.avaliacao < 0) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Avaliação incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (typeof ocorrencia.compartilhar_dados !== 'boolean') {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Compartilhar dados não é booleano]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (ocorrencia.id_cidadao == undefined || ocorrencia.id_cidadao == null || isNaN(ocorrencia.id_cidadao) || ocorrencia.id_cidadao == '' || ocorrencia.id_cidadao <= 0 || !Number.isInteger(Number(ocorrencia.id_cidadao))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id do cidadao Incorreto]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição
    } else if (ocorrencia.id_categoria == undefined || ocorrencia.id_categoria == null || isNaN(ocorrencia.id_categoria) || ocorrencia.id_categoria == '' || ocorrencia.id_categoria <= 0 || !Number.isInteger(Number(ocorrencia.id_categoria))) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [Id da Categoria Incorreta]'
        return MESSAGES.ERROR_REQUIRED_FIELDS // 400 - processar requisição

    } else {
        return false //não teve erros
    }
}

module.exports = {
    registrarOcorrencia,
    obterOcorrencias,
    obterOcorrenciasDeUmCidadao
}
