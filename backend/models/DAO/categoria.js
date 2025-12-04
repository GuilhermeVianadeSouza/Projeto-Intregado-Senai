/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela categoria
 * Data: 03/12/2025
 * Autor: Guilherme Viana
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarTodasAsCategorias() {
    try {
        const sql = `SELECT * FROM tb_categoria`

        const categoria = await prisma.$queryRawUnsafe(sql)
        if (Array.isArray(categoria))
            return categoria
        else
            return false
    } catch (error) {
        return false
    }
}

async function selecionarCategoriaPorID(id) {
    try {
        const sql = `SELECT * FROM tb_categoria WHERE id=${id}`

        const categoria = await prisma.$queryRawUnsafe(sql)
        if (Array.isArray(categoria))
            return categoria
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarTodasAsCategorias,
    selecionarCategoriaPorID
}
