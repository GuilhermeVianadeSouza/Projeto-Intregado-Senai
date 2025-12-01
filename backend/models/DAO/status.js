/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela status
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarStatusAtualPorIdOcorrencia(idOcorrencia) {
    try {
        const sql = `
            SELECT s.nome, s.id, h.data_hora FROM tb_historico_status h JOIN
                tb_status s ON h.id_status = s.id
                WHERE h.id_ocorrencia = ${idOcorrencia}
            ORDER BY
                h.data_hora DESC
            LIMIT 1
        `

        const status = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(status))
            return status
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarStatusAtualPorIdOcorrencia
}
