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

async function obterIdDoCidadaoPorEmailESenha(email, senha) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        const cidadao = await cidadaoDAO.selecionarCidadaoPorEmailSenha(email, senha)

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

async function criarCidadao(cidadao, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (String(contentType).toLocaleUpperCase() != 'APPLICATION/JSON')
            return MESSAGES.ERROR_CONTENT_TYPE

        let validarInformacoes = await validarDadosCidadao(cidadao)

        if (validarInformacoes)
            return validarInformacoes

        let resultadoCidadao = await cidadaoDAO.inserirCidadao(cidadao)

        if (!resultadoCidadao)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let ultimoId = await cidadaoDAO.selecionarUltimoIdDoCidadao()

        if (!ultimoId)
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        cidadao.id = ultimoId
        MESSAGES.DEFAULT_HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.DEFAULT_HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.DEFAULT_HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.DEFAULT_HEADER.cidadao = cidadao

        return MESSAGES.DEFAULT_HEADER
    } catch (error) {
        console.log(error);

        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

function validarDadosCidadao(cidadao) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))
    if (cidadao.nome == '' || cidadao.nome == null || cidadao.nome == undefined || cidadao.nome.length > 120) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Nome inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.email == '' || cidadao.email == null || cidadao.email == undefined || cidadao.email.length > 254) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Email inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.senha == '' || cidadao.senha == null || cidadao.senha == undefined || cidadao.senha.length > 64) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Senha inválida]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.cpf == '' || cidadao.cpf == null || cidadao.cpf == undefined || cidadao.cpf.length > 11) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[CPF inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.telefone == '' || cidadao.telefone == null || cidadao.telefone == undefined || cidadao.telefone.length > 20) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Telefone inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.cep == '' || cidadao.cep == null || cidadao.cep == undefined || cidadao.cep.length > 8) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[CEP inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.estado == '' || cidadao.estado == null || cidadao.estado == undefined || cidadao.estado.length > 2) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Estado inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.cidade == '' || cidadao.cidade == null || cidadao.cidade == undefined || cidadao.cidade.length > 120) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Cidade inválida]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.bairro == '' || cidadao.bairro == null || cidadao.bairro == undefined || cidadao.bairro.length > 150) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Bairro inválido]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.rua == '' || cidadao.rua == null || cidadao.rua == undefined || cidadao.rua.length > 200) {
        MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Rua inválida]'
        return MESSAGES.ERROR_REQUIRED_FIELDS
    } else if (cidadao.complemento !== undefined && cidadao.complemento !== null) {
        if (cidadao.complemento.length > 20) {
            MESSAGES.ERROR_REQUIRED_FIELDS.message += '[Complemento inválido]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }
    } else {
        return false
    }
}

module.exports = {
    obterCidadaoPorId,
    obterCidadaoPorIdOcorrencia,
    obterIdDoCidadaoPorEmailESenha,
    criarCidadao
}
