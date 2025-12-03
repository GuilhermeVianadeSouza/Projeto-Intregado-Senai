/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela localizacao
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
        const sql = `SELECT id_localizacao, cep, rua, numero, bairro, complemento, cidade, estado
                    FROM vw_localizacao_ocorrencia
                    WHERE id_localizacao = ${id}`

        const localizacao = await prisma.$queryRawUnsafe(sql)
        if (Array.isArray(localizacao))
            return localizacao
        else
            return false
    } catch {
        return false
    }
}

module.exports = {
    selecionarLocalizacaoPorID
}
