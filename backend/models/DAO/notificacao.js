/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela notificação.
 * Data: 14/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarNotificacoesPorIdCidadao(id) {
    try {
        const sql = `SELECT * FROM tb_notificacao WHERE id_cidadao = ${id}`

        const notificacao = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(notificacao))
            return notificacao
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarNotificacoesPorIdCidadao
}
