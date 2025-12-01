/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela localização
 * Data: 01/12/2025
 * Autor: Nathan
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarLocalizacaoPorId(id) {
    try {
        const sql = `
            SELECT
                l.id, l.cep, l.estado, l.cidade, l.bairro, l.rua, l.numero, l.complemento
            FROM
                tb_localizacao l, tb_ocorrencia o
            WHERE
                o.id_localizacao = l.id
            AND
                l.id = ${id};
        `

        const localizacao = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(localizacao))
            return localizacao
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarLocalizacaoPorId
}
