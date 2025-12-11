'use strict'

export async function obterIdCidadao(email, senha) {
    const url = `http://localhost:8080/v1/cidadao/email?email=${email}&senha=${senha}`
    const response = await fetch(url)
    const data = response.json()
    return data
}
