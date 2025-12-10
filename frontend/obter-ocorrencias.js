async function obterCategorias() {
    const url = 'http://localhost:8080/v1/categoria'
    const response = await fetch(url)
    const data = await response.json()
    return data.items.categorias
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

// Função auxiliar para preparar o objeto antes de chamar criarPost
function prepararDadosParaPost(ocorrencia) {
    // Acessa a localização, assumindo que é um array e pegando o primeiro item
    const {rua, numero, cidade, estado} = ocorrencia.localizacao?.[0] || {}; 

    // Processamento da Data
    const data = new Date(ocorrencia.data_registro);
    const horas = String(data.getUTCHours()).padStart(2, "0");
    const minutos = String(data.getUTCMinutes()).padStart(2, "0");
    const dia = String(data.getUTCDate()).padStart(2, "0");
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const ano = data.getUTCFullYear();

    // Acessa a categoria, assumindo que é um array e pegando o primeiro item
    const nomeCategoria = ocorrencia.categoria?.[0]?.nome || 'Sem Categoria'; 
    const localFormatado = (rua && numero) ? `${rua} ${numero}, ${cidade}-${estado}` : 'Local não informado';
    
    // --- CRIAÇÃO DO OBJETO FINAL ---
    return {
        dataHora: `${horas}:${minutos} ${dia}/${mes}/${ano}`,
        titulo: nomeCategoria,
        descricao: ocorrencia.descricao,
        local: localFormatado
    };
}


async function carregarOcorrenciasFiltradas(filtros = { pagina: 1, limite: 10 }) {
    try {
        const abaHome = document.getElementById('aba-home');
        
        if (abaHome) {
            const postsExistentes = abaHome.querySelectorAll('.post');
            postsExistentes.forEach(post => {
                post.remove(); 
            });
            
            const avisoExistente = abaHome.querySelector('.aviso-sem-ocorrencia');
            if(avisoExistente) {
                avisoExistente.remove();
            }

            const erroExistente = abaHome.querySelector('.erro-api');
            if(erroExistente) {
                erroExistente.remove();
            }
        }
        
        const dados = await obterOcorrenciaComFiltro(filtros); 

        if (dados && dados.ocorrencias && Array.isArray(dados.ocorrencias)) {
            dados.ocorrencias.forEach(ocorrencia => {
                const elementoPost = prepararDadosParaPost(ocorrencia); // Certifique-se de usar a função prepararDadosParaPost
                criarPost(elementoPost); 
            });
        } else if (abaHome) {
            // Se não encontrar ocorrências, adiciona o aviso SEM apagar a nav
            const aviso = document.createElement('p');
            aviso.classList.add('aviso-sem-ocorrencia');
            aviso.textContent = 'Nenhuma ocorrência encontrada com os filtros aplicados.';
            abaHome.appendChild(aviso);
        }

    } catch (error) {
        const abaHome = document.getElementById('aba-home');
        if (abaHome) {
            // Adiciona a mensagem de erro SEM apagar a nav
            const erro = document.createElement('p');
            erro.classList.add('erro-api');
            erro.textContent = 'Erro ao carregar os dados. Tente novamente.';
            abaHome.appendChild(erro);
        }
    }
}

function aplicarFiltrosCompletos() {
    const filtros = {};

    // Obtém os valores dos selects.
    // Lembre-se: categoria e status agora retornam IDs, e dataPeriodo retorna a string ('3dias', 'semana', etc.)
    const categoria = document.getElementById('categoria-select')?.value;
    const status = document.getElementById('status-select')?.value; 
    const dataPeriodo = document.getElementById('data-select')?.value;
    const localizacao = document.getElementById('localizacao-select')?.value;
    
    // Adicionar paginação padrão
    filtros.pagina = 1;
    filtros.limite = 10;

    // 1. Categoria (Envia o ID da categoria)
    if (categoria) {
        // O backend espera o ID no parâmetro 'categoria' (filtros.id_categoria)
        filtros.id_categoria = categoria; 
    }
    
    // 2. Status (Envia o ID do status)
    if (status) {
        // O backend espera o ID do status no parâmetro 'status' (filtros.status)
        filtros.status = status; 
    }
    
    // 3. Data (Envia a string de período)
    if (dataPeriodo) {
        // O backend espera a string ('3dias', 'semana', 'mes') no parâmetro 'dataRegistro' (filtros.data_registro)
        filtros.data_registro = dataPeriodo;
    }
    
    // 4. Localização (Mantido como um placeholder, pois o backend não o suporta)
    if (localizacao) {
        // Você pode decidir como tratar o filtro de localização aqui, se o backend for implementá-lo.
    }

    carregarOcorrenciasFiltradas(filtros);
}

// Sua função criarOcorrenciasComunidade agora pode ser simplificada para chamar carregarOcorrenciasFiltradas
export async function criarOcorrenciasComunidade() {
    // Esta função agora pode apenas garantir o carregamento inicial sem filtros
    await carregarOcorrenciasFiltradas({ pagina: 1, limite: 10 });
}

function configurarListenerDeFiltro() {
    // 1. Obter o elemento de input/select do filtro (ID CORRIGIDO)
    const inputCategoria = document.getElementById("categoria-select");

    if (!inputCategoria) {
     
        return;
    }

    inputCategoria.addEventListener('change', (evento) => {
        const categoriaSelecionada = evento.target.value;

        // Verifica se um valor válido (não vazio/disabled) foi selecionado
        if (categoriaSelecionada && categoriaSelecionada !== 'Categoria') {;
            
            const filtros = {
                id_categoria: categoriaSelecionada,
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


// Ajustar o DOMContentLoaded para incluir o novo listener
document.addEventListener('DOMContentLoaded', () => {
    criarDropBoxCategorias(); 
    configurarListenerDeFiltro(); // Listener da Categoria
});
