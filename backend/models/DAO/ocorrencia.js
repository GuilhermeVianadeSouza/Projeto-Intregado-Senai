/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela localizacao
 * Data: 04/12/2025
 * Autor: Guilherme Viana
 * Versão: 1.0
 ******************************************************************************/

// Import do Client do prisma
const { PrismaClient } = require('../../generated/prisma')

// Criação de um objeto do Client
const prisma = new PrismaClient()

async function selecionarUltimoIdDaOcorrencia() {
    try {
        const sql = `SELECT id FROM tb_ocorrencia ORDER BY id DESC LIMIT 1`

        const ocorrencia = await prisma.$queryRawUnsafe(sql)
        if (Array.isArray(ocorrencia))
            return Number(ocorrencia[0].id)
        else
            return false
    } catch (error) {
        return false
    }
}

async function registrarOcorrencia(ocorrencia) {
    try {
        const sql = `INSERT INTO tb_ocorrencia(
        descricao,
        data_registro,
        avaliacao,
        compartilhar_dados,
        id_cidadao,
        id_localizacao,
        id_categoria
        )
        VALUES(
        '${ocorrencia.descricao}',
        '${ocorrencia.data_registro}',
        ${ocorrencia.avaliacao},
        ${ocorrencia.compartilhar_dados},
        ${ocorrencia.id_cidadao},
        ${ocorrencia.id_localizacao},
        ${ocorrencia.id_categoria}
        )`

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
    selecionarUltimoIdDaOcorrencia,
    registrarOcorrencia
}
