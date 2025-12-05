/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela localizacao.
 * Data: 03/12/2025
 * Autor: Guilherme Viana
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarLocalizacaoPorID(id) {
    try {
        const sql = `SELECT * FROM tb_localizacao WHERE id = ${id}`

        const localizacao = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(localizacao))
            return localizacao
        else
            return false

    } catch {
        return false
    }
}

async function selecionarUltimaLocalizacaoRegistrada() {
    try {
        const sql = `SELECT id FROM tb_localizacao order by id desc limit 1`

        const localizacao = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(localizacao))
            return Number(localizacao[0].id)
        else
            return false

    } catch (error) {
        return false
    }
}

async function inserirLocalizacao(localizacao) {
    try {
        const sql = `
            INSERT INTO tb_localizacao(
                cep,
                estado,
                cidade,
                bairro,
                rua,
                numero,
                complemento
            ) VALUES (
                '${localizacao.cep}',
                '${localizacao.estado}',
                '${localizacao.cidade}',
                '${localizacao.bairro}',
                '${localizacao.rua}',
                '${localizacao.numero}',
                '${localizacao.complemento}'
            )
        `

        const result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarLocalizacaoPorID,
    selecionarUltimaLocalizacaoRegistrada,
    inserirLocalizacao
}
