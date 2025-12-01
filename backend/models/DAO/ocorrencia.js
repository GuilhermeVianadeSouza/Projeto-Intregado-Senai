/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela status
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarDezOcorrenciasRecentes() {
    try {
        const sql = `SELECT * FROM tb_ocorrencia ORDER BY data_registro DESC LIMIT 10`

        const ocorrencias = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(ocorrencias))
            return ocorrencias
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarDezOcorrenciasRecentes
}
