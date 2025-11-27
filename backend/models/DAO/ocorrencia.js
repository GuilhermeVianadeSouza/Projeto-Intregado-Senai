/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela ocorrencia
 * Data: 26/11/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarTodasOcorrencias() {
    try {
        let sql = `SELECT * FROM tb_ocorrencia ORDER BY id DESC`

        let ocorrencias = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(ocorrencias))
            return ocorrencias
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarTodasOcorrencias
}
