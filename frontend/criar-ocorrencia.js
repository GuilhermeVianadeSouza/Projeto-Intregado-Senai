'use strict'

async function criarNovaOcorrencia(ocorrencia) {
    const url = 'http://localhost:8080/v1/ocorrencia'

    const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(ocorrencia)
    }

    const response = await fetch(url, options)

    return response.ok
}

export async function pegarDadosParaCriarOcorrencia() {

}
