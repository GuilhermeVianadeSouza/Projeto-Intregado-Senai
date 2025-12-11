'use strict'

async function obterDadosPerfil(id) {
    const url = `http://localhost:8080/v1/cidadao/${id}`
    const response = await fetch(url)
    const data = response.json()
    return data
}

export async function colocarDadosPerfil(id) {
    const data = await obterDadosPerfil(id)

    const endereco = data.cidadao[0].rua
    const bairro = data.cidadao[0].bairro
    const cidade = data.cidadao[0].cidade
    const estado = data.cidadao[0].estado

    const localizacaoString = `${endereco}, ${bairro}, ${cidade}-${estado}`

    document.getElementById('perfil-nome').textContent = data.cidadao[0].nome
    document.getElementById('perfil-local').textContent = localizacaoString
    document.getElementById('perfil-email').textContent = data.cidadao[0].email
    document.getElementById('perfil-telefone').textContent = data.cidadao[0].telefone
}
