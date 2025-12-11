/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela
 *           historico_status.
 * Data: 04/12/2025
 * Autor: Guilherme Viana
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarUltimoIdDoHistorico() {
    try {
        const sql = `SELECT id FROM tb_historico_status ORDER BY id DESC limit 1`

        const historico = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(historico))
            return Number(historico[0].id)
        else
            return false

    } catch (error) {
        return false
    }
}

async function inserirHistorico(historico) {
    try {
        const sql = `
            INSERT INTO tb_historico_status(
                data_hora,
                id_status,
                id_ocorrencia
            ) VALUES (
                '${historico.data_hora}',
                ${historico.id_status},
                ${historico.id_ocorrencia}
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

async function inserirNovoHistorico(ocorrenciaId) {
    try {
        const sql = `
            INSERT INTO tb_historico_status(
                data_hora,
                id_status,
                id_ocorrencia
            ) VALUES (
                ?,
                ?,
                ?
            )
        `

        const dataAtual = new Date()
        dataAtual.setHours(dataAtual.getHours() - 3);

        const result = await prisma.$executeRawUnsafe(sql, dataAtual, 1, ocorrenciaId)


        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

async function selecionarHistoricoOcorrencia(idOcorrencia) {
    try {
        const sql = `
            SELECT *
            FROM tb_historico_status
            WHERE id_ocorrencia = ${idOcorrencia}
            ORDER BY data_hora ASC
        `

        const historico = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(historico))
            return historico
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    selecionarUltimoIdDoHistorico,
    inserirHistorico,
    inserirNovoHistorico,
    selecionarHistoricoOcorrencia
}
