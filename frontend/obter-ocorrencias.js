async function obterCategorias() {
    const url = 'http://localhost:8080/v1/categoria'
    const response = await fetch(url)
    const data = await response.json()
    return data.categorias
}

export async function criarDropBoxCategorias(container) {
    try {
        const categorias = await obterCategorias();

        if (Array.isArray(categorias) && categorias.length > 0) {
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                container.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.textContent = 'Nenhuma categoria disponível';
            option.disabled = true;
            container.appendChild(option);
        }

    } catch (error) {
        console.log(error);

        return error;
    }
}

// Função de buscar ocorrencia com filtros
export async function obterOcorrenciaComFiltro(filtros) {
    const parametros = new URLSearchParams()

    parametros.append('pagina', filtros.pagina || 1)
    parametros.append('limite', filtros.limite || 10)

    if (filtros.id_categoria) parametros.append('categoria', filtros.id_categoria)
    if (filtros.status) parametros.append('status', filtros.status)
    if (filtros.data_registro) parametros.append('dataRegistro', filtros.data_registro)

    const url = 'http://localhost:8080/v1/ocorrencia'
    try {
        const response = await fetch(`${url}?${parametros.toString()}`)
        return await response.json()
    } catch (error) {
        throw error
    }
}

const abaHome = document.getElementById("aba-home")

function criarPost(ocorrencia) {
    const section = document.createElement("section")
    section.classList.add("post")

    const header = document.createElement("header")
    header.classList.add("post-header")

    const imgPerfil = document.createElement("img")
    imgPerfil.classList.add("post-perfil")
    imgPerfil.src = "./img/user-placeholder.png"
    imgPerfil.alt = "Perfil"

    const divAutor = document.createElement("div")
    divAutor.classList.add("post-autor")

    const spanNome = document.createElement("span")
    spanNome.classList.add("autor-nome")
    spanNome.textContent = ocorrencia.autor

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
    imgPost.alt = "Imagem do post"
    imgPost.src = ocorrencia.multimidia

    imgPost.onerror = () => {
        imgPost.src = "./img/image-placeholder.png"
    }

    section.addEventListener('click', () => {
        document.getElementById('aba-verPost').classList.add('active');
    });

    divMedia.appendChild(imgPost)

    section.appendChild(header)
    section.appendChild(h2)
    section.appendChild(pDesc)
    section.appendChild(pLoc)
    section.appendChild(divMedia)

    abaHome.appendChild(section)
}

// Função auxiliar para preparar o objeto antes de chamar criarPost
function prepararDadosParaPost(ocorrencia) {
    // Localização
    const localizacao = ocorrencia.localizacao?.[0] || {};
    const { rua, numero, cidade, estado } = localizacao;

    // Cidadão
    const nomeCidadao = ocorrencia.cidadao?.[0]?.nome || 'Anônimo';

    // Multimídia
    const multimidia = ocorrencia.multimidia?.[0]?.link || './img/image-placeholder.png';

    // Processamento da data
    const data = new Date(ocorrencia.data_registro);
    const horas = String(data.getUTCHours()).padStart(2, "0");
    const minutos = String(data.getUTCMinutes()).padStart(2, "0");
    const dia = String(data.getUTCDate()).padStart(2, "0");
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const ano = data.getUTCFullYear();

    const nomeCategoria = ocorrencia.categoria?.[0]?.nome || 'Sem Categoria';

    const numeroString = numero === 'null' ? '' : ` ${numero}`;
    const localFormatado = rua ? `${rua}${numeroString}, ${cidade}-${estado}` : 'Local não informado';

    return {
        dataHora: `${horas}:${minutos} ${dia}/${mes}/${ano}`,
        titulo: nomeCategoria,
        descricao: ocorrencia.descricao || '',
        local: localFormatado,
        autor: nomeCidadao,
        multimidia
    };
}


async function carregarOcorrenciasFiltradas(filtros = { pagina: 1, limite: 10 }) {
    try {
        if (abaHome) {
            const postsExistentes = abaHome.querySelectorAll('.post');
            postsExistentes.forEach(post => {
                post.remove();
            });

            const avisoExistente = abaHome.querySelector('.aviso-sem-ocorrencia');
            if (avisoExistente) {
                avisoExistente.remove();
            }

            const erroExistente = abaHome.querySelector('.erro-api');
            if (erroExistente) {
                erroExistente.remove();
            }
        }

        const dados = await obterOcorrenciaComFiltro(filtros);

        if (dados && dados.ocorrencias && Array.isArray(dados.ocorrencias)) {
            dados.ocorrencias.forEach(ocorrencia => {
                const elementoPost = prepararDadosParaPost(ocorrencia)
                criarPost(elementoPost)
            });
        } else if (abaHome) {
            const aviso = document.createElement('p')
            aviso.classList.add('aviso-sem-ocorrencia')
            aviso.textContent = 'Nenhuma ocorrência encontrada com os filtros aplicados.'
            abaHome.appendChild(aviso)
        }

    } catch (error) {
        console.log(error);

        if (abaHome) {
            const erro = document.createElement('p')
            erro.classList.add('erro-api')
            erro.textContent = 'Erro ao carregar os dados. Tente novamente.'
            abaHome.appendChild(erro)
        }
    }
}

export function aplicarFiltrosCompletos() {
    const filtros = {}

    // Obtém os valores dos selects.
    const categoria = document.getElementById('categoria-select')?.value
    const status = document.getElementById('status-select')?.value
    const dataPeriodo = document.getElementById('data-select')?.value

    // Adicionar paginação padrão
    filtros.pagina = 1
    filtros.limite = 10

    // 1. Categoria (Envia o ID da categoria)
    if (categoria) {
        filtros.id_categoria = categoria
    }

    // 2. Status (Envia o ID do status)
    if (status) {
        filtros.status = status;
    }
    // 3. Data (Envia a string de período)
    if (dataPeriodo) {
        filtros.data_registro = dataPeriodo
    }

    carregarOcorrenciasFiltradas(filtros)
}

export async function criarOcorrenciasComunidade() {

    await carregarOcorrenciasFiltradas({ pagina: 1, limite: 10 })
}

export function configurarListenerDeFiltro() {

    const inputCategoria = document.getElementById("categoria-select")
    const inputData = document.getElementById("data-select")
    const inputStatus = document.getElementById("status-select")

    inputCategoria.addEventListener('change', aplicarFiltrosCompletos)
    inputData.addEventListener('change', aplicarFiltrosCompletos)
    inputStatus.addEventListener('change', aplicarFiltrosCompletos)
}


