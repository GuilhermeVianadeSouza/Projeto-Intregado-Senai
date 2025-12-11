async function obterOcorrenciasCidadao(id) {
    const url = `http://localhost:8080/v1/ocorrencia/cidadao/${id}`
    const response = await fetch(url)
    const data = await response.json()
    return data.ocorrencias
}

export async function criarOcorrencias(id) {
    const ocorrencias = await obterOcorrenciasCidadao(id)
    const user = JSON.parse(localStorage.getItem('user'))
    ocorrencias.forEach(ocorrencia => {
        const localizacao = ocorrencia.localizacao && ocorrencia.localizacao[0];
        const { rua, numero, cidade, estado } = localizacao || {};

        const numeroString = numero === 'null' ? '' : ` ${numero}`;
        const local = rua ? `${rua}${numeroString}, ${cidade}-${estado}` : "Local não informado";

        const data = new Date(ocorrencia.data_registro);
        const horas = String(data.getUTCHours()).padStart(2, "0");
        const minutos = String(data.getUTCMinutes()).padStart(2, "0");
        const dia = String(data.getUTCDate()).padStart(2, "0");
        const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
        const ano = data.getUTCFullYear();

        const categoria = ocorrencia.categoria && ocorrencia.categoria[0];
        const titulo = categoria ? categoria.nome : "Sem categoria";

        const multimidiaUrl = (ocorrencia.multimidia && ocorrencia.multimidia[0]?.link) || './img/image-placeholder.png';

        const elemento = {
            dataHora: `${horas}:${minutos} ${dia}/${mes}/${ano}`,
            titulo,
            descricao: ocorrencia.descricao,
            local,
            nome: user.nome,
            multimidia: multimidiaUrl
        }

        criarPost(elemento);
    });
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
    imgPerfil.alt = "Perfil"
    imgPerfil.src = './img/user-placeholder.png'

    const divAutor = document.createElement("div")
    divAutor.classList.add("post-autor")

    const spanNome = document.createElement("span")
    spanNome.classList.add("autor-nome")
    spanNome.textContent = ocorrencia.nome

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
    imagem.alt = "Imagem do post"
    imagem.src = ocorrencia.multimidia

    imagem.onerror = () => {
        imagem.src = "./img/image-placeholder.png"
    }

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
