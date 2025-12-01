/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela multimidia
 * Data: 27/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarUmaMultimidiaPorIdOcorrencia(idOcorrencia) {
    try {
        const sql = `
            SELECT
                id, link FROM tb_multimidia
            WHERE
                id_ocorrencia = ${idOcorrencia}
            LIMIT 1
        `

        const multimidia = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(multimidia))
            return multimidia
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarUmaMultimidiaPorIdOcorrencia
}
