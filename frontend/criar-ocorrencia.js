'use strict'

async function postOcorrencia(ocorrencia) {
    try {
        const url = 'http://localhost:8080/v1/ocorrencia'

        const options = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(ocorrencia)
        }

        const response = await fetch(url, options)

        const data = await response.json()

        console.log(data)

    } catch (error) {
        console.log(error)
    }
}

export async function CriarNovaOcorrencia(ocorrencia) {
    await postOcorrencia(ocorrencia)
}
