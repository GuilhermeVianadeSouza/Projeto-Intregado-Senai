async function obterOcorrencias() {
    const url = 'http://localhost:8080/v1/ocorrencia?limite=10&pagina=1'
    const response = await fetch(url)
    const data = await response.json()
    return data.ocorrencias
}

async function obterCategorias() {
    const url = 'http://localhost:8080/v1/categoria'
    const response = await fetch(url)
    const data = await response.json()
    return data.items.categorias
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

async function criarDropBoxCategorias() {
    const selectElement = document.getElementById('categoria-select');

    if (!selectElement) {
        return error;
    }

    try {
        const categorias = await obterCategorias(); 

        if (Array.isArray(categorias) && categorias.length > 0) {
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;      
                option.textContent = categoria.nome; 
                selectElement.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.textContent = 'Nenhuma categoria disponível';
            option.disabled = true;
            selectElement.appendChild(option);
        }

    } catch (error) {
       return error;
    }
}

// Função de buscar ocorrencia com filtros
export async function obterOcorrenciaComFiltro(filtros){
    //Primeiramente: defino que os padrões são inicialmente "nulos"
    const parametros = new URLSearchParams()
    //Para esses parametros em especifico 
    parametros.append('pagina', filtros.pagina || 1)
    parametros.append('limite', filtros.limite || 10)

    if(filtros.id_categoria) parametros.append('categoria', filtros.id_categoria)
    if(filtros.status) parametros.append('status', filtros.status)
    if(filtros.data_registro) parametros.append('data_registro', filtros.data_registro)

    const url = 'http://localhost:8080/v1/ocorrencia'
    try {
        const response = await fetch(`${url}?${parametros.toString()}`)
        return await response.json()
    } catch (error) {
        throw error
    }
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

async function carregarOcorrenciasFiltradas(filtros = { pagina: 1, limite: 10 }) {
    try {
        const abaHome = document.getElementById('aba-home');
        
        if (abaHome) {
            // Encontra e remove todos os elementos que têm a classe 'post' dentro de 'aba-home'
            const postsExistentes = abaHome.querySelectorAll('.post');
            
            postsExistentes.forEach(post => {
                post.remove(); 
            });
        }

        const dados = await obterOcorrenciaComFiltro(filtros); 
        
        // --- 3. RENDERIZAÇÃO DOS NOVOS POSTS ---
        if (dados && dados.ocorrencias && Array.isArray(dados.ocorrencias)) {
            dados.ocorrencias.forEach(ocorrencia => {
                // Chama a função que cria e insere o novo post na aba-home
                criarPost(ocorrencia); 
            });
        } else if (abaHome) {
             const aviso = document.createElement('p');
             aviso.classList.add('aviso-sem-ocorrencia');
             aviso.textContent = 'Nenhuma ocorrência encontrada com os filtros aplicados.';
             abaHome.appendChild(aviso);
        }

    } catch (error) {
        const abaHome = document.getElementById('aba-home');
        if (abaHome) {
             abaHome.innerHTML = '<p class="erro-api">Erro ao carregar os dados. Tente novamente.</p>';
        }
    }
}

function configurarListenerDeFiltro() {
    // 1. Obter o elemento de input/select do filtro (ID CORRIGIDO)
    const inputCategoria = document.getElementById("categoria-select");

    if (!inputCategoria) {
     
        return;
    }

    // 2. Adicionar o listener para o evento 'change'
    inputCategoria.addEventListener('change', (evento) => {
        // Pega o valor selecionado do input (ex: 'entulho', 'manutencao')
        const categoriaSelecionada = evento.target.value;

        // Verifica se um valor válido (não vazio/disabled) foi selecionado
        if (categoriaSelecionada && categoriaSelecionada !== 'Categoria') {;
            
            const filtros = {
                categoria: categoriaSelecionada,
                pagina: 1, 
                limite: 10
            };

            // Chamar a função de busca e renderização
            carregarOcorrenciasFiltradas(filtros);
            
        } else {
            carregarOcorrenciasFiltradas({ pagina: 1, limite: 10 }); 
        }
    });
}



// Adiciona um listener para garantir que a função seja chamada após o carregamento do HTML
document.addEventListener('DOMContentLoaded', () => {
    criarDropBoxCategorias(); 
    configurarListenerDeFiltro();
});
