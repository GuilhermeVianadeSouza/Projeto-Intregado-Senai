'use strict'

async function obterDadosOcorrencia(id) {
    const url = `http://localhost:8080/v1/ocorrencia/${id}`
    const response = await fetch(url)
    const data = response.json()
    return data
}

export async function visualizarDetalhesOcorrencia(id) {
    const data = await obterDadosOcorrencia(id)
    console.log(data);

    // Processamento da data
    const dataOcorrencia = new Date(data.ocorrencias.data_registro);
    const horas = String(dataOcorrencia.getUTCHours()).padStart(2, "0");
    const minutos = String(dataOcorrencia.getUTCMinutes()).padStart(2, "0");
    const dia = String(dataOcorrencia.getUTCDate()).padStart(2, "0");
    const mes = String(dataOcorrencia.getUTCMonth() + 1).padStart(2, "0");
    const ano = dataOcorrencia.getUTCFullYear();

    const { rua, numero, cidade, estado } = data.ocorrencias.localizacao[0];

    const numeroString = numero === 'null' ? '' : ` ${numero}`;
    const localFormatado = rua ? `${rua}${numeroString}, ${cidade}-${estado}` : 'Local não informado';

    const ocorrencia = {
        autorNome: data.ocorrencias.cidadao[0].nome,
        data: `${horas}:${minutos} ${dia}/${mes}/${ano}`,
        titulo: data.ocorrencias.categoria[0].nome,
        descricao: data.ocorrencias.descricao,
        localizacao: localFormatado,
        midias: data.ocorrencias.multimidia
    }
    atualizarCamposDetalhes(ocorrencia)
}

function atualizarCamposDetalhes(ocorrencia) {
    document.getElementById("autor-nome-visualizar").textContent = ocorrencia.autorNome;
    document.getElementById("post-data-visualizar").textContent = ocorrencia.data;
    document.getElementById("post-titulo-visualizar").textContent = ocorrencia.titulo;
    document.getElementById("post-desc-visualizar").textContent = ocorrencia.descricao;
    document.getElementById("post-loc-visualizar").textContent = ocorrencia.localizacao;

    // Container de mídia
    const mediaContainer = document.getElementById("post-media-visualizar");

    // Limpa imagens anteriores
    mediaContainer.replaceChildren()

    // Cria uma <img> para cada item do array
    ocorrencia.midias.forEach(src => {
        const img = document.createElement("img");
        img.classList.add("post-img");
        img.src = src.link;
        img.onerror = () => {
            img.src = "./img/image-placeholder.png"
        }
        img.alt = "Imagem do post";

        mediaContainer.appendChild(img);
    });
    iniciarSlider(mediaContainer)

}

let indiceAtual = 0;

function iniciarSlider(container) {
    const btnPrev = document.getElementById("media-prev");
    const btnNext = document.getElementById("media-next");

    const total = container.children.length;

    if (total <= 1) {
        btnPrev.classList.add("hidden");
        btnNext.classList.add("hidden");
        return;
    }

    btnPrev.classList.remove("hidden");
    btnNext.classList.remove("hidden");

    btnPrev.onclick = () => {
        if (indiceAtual > 0) {
            indiceAtual--;
            moverSlider(container);
        }
    };

    btnNext.onclick = () => {
        if (indiceAtual < total - 1) {
            indiceAtual++;
            moverSlider(container);
        }
    };
}

function moverSlider(container) {
    const larguraSlide = container.clientWidth;
    container.scrollTo({
        left: larguraSlide * indiceAtual,
        behavior: "smooth"
    });
}
