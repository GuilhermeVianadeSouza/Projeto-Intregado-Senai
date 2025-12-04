/*******************************************************************************
 * Objetivo: Arquivo responsável pelas operações no MySQL da tabela ocorrencia.
 * Data: 01/12/2025
 * Autor: Nathan, Guilherme Viana
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
async function selecionarOcorrencias(
    limite, pagina, categoriaId, status, dataRegistro, ordenar = 'DESC'
) {
    try {
        const offset = (pagina - 1) * limite

        let sql = 'SELECT o.* FROM tb_ocorrencia o WHERE 1 = 1 '

        if (categoriaId)
            sql += `AND id_categoria = ${categoriaId} `

        if (status) {
            sql += `
                AND (
                    SELECT s.id
                    FROM tb_historico_status hs
                    JOIN tb_status s ON s.id = hs.id_status
                    WHERE hs.id_ocorrencia = o.id
                    ORDER BY hs.data_hora DESC
                    LIMIT 1
                ) = ${status} `
        }

        if (dataRegistro) {
            switch (dataRegistro) {
                case '3dias':
                    sql += 'AND o.data_registro >= NOW() - INTERVAL 3 DAY '
                    break

                case 'semana':
                    sql += 'AND o.data_registro >= NOW() - INTERVAL 1 WEEK '
                    break

                case 'mes':
                    sql += 'AND o.data_registro >= NOW() - INTERVAL 1 MONTH '
                    break

                case 'ano':
                    sql += 'AND o.data_registro >= NOW() - INTERVAL 1 YEAR '
                    break
            }
        }

        sql += `ORDER BY data_registro ${ordenar}
            LIMIT ${limite} OFFSET ${offset}`

        const ocorrencias = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(ocorrencias))
            return ocorrencias
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
    registrarOcorrencia,
    selecionarOcorrencias
}
