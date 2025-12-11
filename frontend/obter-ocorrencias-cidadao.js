async function obterOcorrenciasCidadao(id) {
    const url = `http://localhost:8080/v1/ocorrencia/cidadao/${id}`
    const response = await fetch(url)
    const data = await response.json()
    return data.ocorrencias
}

export async function criarOcorrencias(id) {
    const ocorrencias = await obterOcorrenciasCidadao(id)
    ocorrencias.forEach(ocorrencia => {

        const { rua, numero, cidade, estado } = ocorrencia.localizacao[0]

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
    const divPai = document.getElementById("aba-minhasOcorrencias")
    const container = divPai.querySelector("div")

    const section = document.createElement("section")
    section.classList.add("post")

    const header = document.createElement("header")
    header.classList.add("post-header")

    const imgPerfil = document.createElement("img")
    imgPerfil.classList.add("post-perfil")
    imgPerfil.src = './img/profile img.png'
    imgPerfil.alt = "Perfil"

    const divAutor = document.createElement("div")
    divAutor.classList.add("post-autor")

    const spanNome = document.createElement("span")
    spanNome.classList.add("autor-nome")
    spanNome.textContent = 'Victor Hugo'

    const spanData = document.createElement("span")
    spanData.classList.add("post-data")
    spanData.textContent = ocorrencia.dataHora

    divAutor.appendChild(spanNome)
    divAutor.appendChild(spanData)

    header.appendChild(imgPerfil)
    header.appendChild(divAutor)

    const titulo = document.createElement("h2")
    titulo.classList.add("post-titulo")
    titulo.textContent = ocorrencia.titulo

    const descricao = document.createElement("p")
    descricao.classList.add("post-desc")
    descricao.textContent = ocorrencia.descricao

    const localizacao = document.createElement("p")
    localizacao.classList.add("post-loc")
    localizacao.textContent = ocorrencia.local

    const divImg = document.createElement("div")
    divImg.classList.add("post-media")

    const imagem = document.createElement("img")
    imagem.classList.add("post-img")
    imagem.src = './img/image 3.png'
    imagem.alt = "Imagem do post"

    section.addEventListener('click', () => {
        document.getElementById('aba-verPost').classList.add('active');
    });

    divImg.appendChild(imagem)

    section.appendChild(header)
    section.appendChild(titulo)
    section.appendChild(descricao)
    section.appendChild(localizacao)
    section.appendChild(divImg)


    container.appendChild(section)
}
