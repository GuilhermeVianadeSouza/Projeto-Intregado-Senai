async function obterOcorrencias() {
    const url = 'http://localhost:8080/v1/ocorrencia?limite=10&pagina=1'
    const response = await fetch(url)
    const data = await response.json()
    return data.ocorrencias
}

export async function criarOcorrenciasComunidade() {
    const ocorrencias = await obterOcorrencias()
    ocorrencias.forEach(ocorrencia => {
        const {rua, numero, cidade, estado} = ocorrencia.localizacao[0]

        const data = new Date(ocorrencia.data_registro)

        const horas = String(data.getUTCHours()).padStart(2, "0")
        const minutos = String(data.getUTCMinutes()).padStart(2, "0")
        const dia = String(data.getUTCDate()).padStart(2, "0")
        const mes = String(data.getUTCMonth() + 1).padStart(2, "0")
        const ano = data.getUTCFullYear()

        const elemento = {
            dataHora: `${horas}:${minutos} ${dia}/${mes}/${ano}`,
            titulo: ocorrencia.categoria[0].nome,
            descricao: ocorrencia.descricao,
            local: `${rua} ${numero}, ${cidade}-${estado}`
        }
        criarPost(elemento)
    })
}

function criarPost(ocorrencia) {
    const abaHome = document.getElementById("aba-home")

    const section = document.createElement("section")
    section.classList.add("post")

    const header = document.createElement("header")
    header.classList.add("post-header")

    const imgPerfil = document.createElement("img")
    imgPerfil.classList.add("post-perfil")
    imgPerfil.src = "./img/profile img.png"
    imgPerfil.alt = "Perfil"

    const divAutor = document.createElement("div")
    divAutor.classList.add("post-autor")

    const spanNome = document.createElement("span")
    spanNome.classList.add("autor-nome")
    spanNome.textContent = "Victor Hugo"

    const spanData = document.createElement("span")
    spanData.classList.add("post-data")
    spanData.textContent = ocorrencia.dataHora

    divAutor.appendChild(spanNome)
    divAutor.appendChild(spanData)

    header.appendChild(imgPerfil)
    header.appendChild(divAutor)

    const h2 = document.createElement("h2")
    h2.classList.add("post-titulo")
    h2.textContent = ocorrencia.titulo

    const pDesc = document.createElement("p")
    pDesc.classList.add("post-desc")
    pDesc.textContent = ocorrencia.descricao

    const pLoc = document.createElement("p")
    pLoc.classList.add("post-loc")
    pLoc.textContent = ocorrencia.local

    const divMedia = document.createElement("div")
    divMedia.classList.add("post-media")

    const imgPost = document.createElement("img")
    imgPost.classList.add("post-img")
    imgPost.src = "./img/image 3.png"
    imgPost.alt = "Imagem do post"

    divMedia.appendChild(imgPost)

    section.appendChild(header)
    section.appendChild(h2)
    section.appendChild(pDesc)
    section.appendChild(pLoc)
    section.appendChild(divMedia)

    abaHome.appendChild(section)
}
