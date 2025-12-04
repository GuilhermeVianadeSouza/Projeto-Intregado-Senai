/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela cidadao
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarCidadaoPorId(id) {
    try {
        const sql = `
            SELECT
                c.id, c.nome, c.email, c.telefone, c.cpf, c.cep,
                c.estado, c.cidade, c.bairro, c.rua, c.complemento
            FROM
                tb_cidadao c
            WHERE
                id = ${id}
        `

        const cidadao = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(cidadao))
            return cidadao
        else
            return false

    } catch (error) {
        return false
    }
}

async function selecionarCidadaoPorIdOcorrencia(idOcorrencia) {
    try {
        const sql = `
            SELECT
                c.id, c.nome, c.email, c.telefone, c.cpf, c.cep,
                c.estado, c.cidade, c.bairro, c.rua, c.complemento
            FROM
                tb_cidadao c, tb_ocorrencia o
            WHERE
                o.id_cidadao = c.id
            AND
                o.id_cidadao = ${idOcorrencia};
        `

        const cidadao = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(cidadao))
            return cidadao
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarCidadaoPorId,
    selecionarCidadaoPorIdOcorrencia
}
