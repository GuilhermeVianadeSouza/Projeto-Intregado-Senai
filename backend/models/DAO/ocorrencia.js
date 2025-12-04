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

module.exports = {
    selecionarOcorrencias
}
