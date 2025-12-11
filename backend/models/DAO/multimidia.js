/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela multimidia.
 * Data: 12/12/2025
 * Autor: Victor Hugo
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarCincoMultimidiaPorIdOcorrencia(idOcorrencia) {
    try {
        const sql = `
            SELECT
                id, link FROM tb_multimidia
            WHERE
                id_ocorrencia = ${idOcorrencia}
            LIMIT 5
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


async function selecionarUltimoIdMultimidia() {
    try {
        const sql = `SELECT id FROM tb_multimidia order by id desc limit 1`

        const multimidia = await prisma.$queryRawUnsafe(sql)
        if (Array.isArray(multimidia))
            return Number(multimidia[0].id)
        else
            return false
    } catch (error) {
        return false
    }
}

async function registrarUmaMultimidia(multimidia) {
    try {
        const sql = `INSERT INTO tb_multimidia(
        link,
        id_ocorrencia
        )
        VALUES(
        '${multimidia.link}',
        ${multimidia.id_ocorrencia})`

        const result = await prisma.$queryRawUnsafe(sql)
        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarUltimoIdMultimidia,
    registrarUmaMultimidia,
    selecionarCincoMultimidiaPorIdOcorrencia
}
