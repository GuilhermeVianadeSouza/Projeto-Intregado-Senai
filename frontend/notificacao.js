
export async function inicializarNotificacoes(idCidadao) {
    const iconBtn = document.getElementById("notification-icon");
    const dropdown = document.getElementById("notification-dropdown");

    if (iconBtn && dropdown) {
        const novoIconBtn = iconBtn.cloneNode(true);
        iconBtn.parentNode.replaceChild(novoIconBtn, iconBtn);

        novoIconBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const estaVisivel = dropdown.style.display === "block";
            dropdown.style.display = estaVisivel ? "none" : "block";
        });

        document.addEventListener("click", (e) => {
            if (!novoIconBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });
    }

    if (!idCidadao) {
        console.warn("Notificações: ID não fornecido.");
        return;
    }


    try {

        const url = `http://localhost:8080/v1/notificacao/cidadao/${idCidadao}`;
        const response = await fetch(url);

        if (!response.ok) {
            const textoErro = await response.text();
            throw new Error(`Erro API (${response.status}): ${textoErro}`);
        }

        const dados = await response.json();
        
        const lista = dados.notificacao || [];
        renderizarLista(lista);

    } catch (error) {
        if (error.message.includes("Failed to fetch")) {
        }
    }

}

function renderizarLista(lista) {
    const dropdown = document.getElementById("notification-dropdown");
    const badge = document.getElementById("notification-count");

    // Limpa o conteúdo antigo de forma segura
    dropdown.replaceChildren();

    // --- Cria o Cabeçalho ---
    const header = document.createElement("div");
    header.textContent = "Notificações";
    // Estilos inline básicos para o header (ou mova para o CSS)
    header.style.padding = "10px";
    header.style.fontWeight = "bold";
    header.style.backgroundColor = "#f8f9fa";
    header.style.borderBottom = "1px solid #ddd";
    dropdown.appendChild(header);

    // Ordenação (Mais recentes primeiro)
    lista.sort((a, b) => new Date(b.data_envio) - new Date(a.data_envio));

    let contadorNaoLidas = 0;

    if (lista.length === 0) {
        const msgVazia = document.createElement("div");
        msgVazia.textContent = "Nenhuma notificação encontrada.";
        msgVazia.style.padding = "15px";
        msgVazia.style.textAlign = "center";
        msgVazia.style.color = "#666";
        dropdown.appendChild(msgVazia);
    } else {
        // --- Cria os Itens da Lista ---
        lista.forEach(notificacao => {
            // Verifica visualizado (0 = não lido)
            const naoLida = notificacao.visualizado === 0 || notificacao.visualizado === false;
            
            if (naoLida) contadorNaoLidas++;

            // Container do item
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("notificacao-item");
            if (naoLida) itemDiv.classList.add("notificacao-nao-lida");

            // Texto da mensagem
            const pTexto = document.createElement("p");
            pTexto.classList.add("notificacao-texto");
            pTexto.textContent = notificacao.mensagem;

            // Data
            const spanData = document.createElement("span");
            spanData.classList.add("notificacao-data");
            spanData.textContent = formatarData(notificacao.data_envio);

            // Monta o item
            itemDiv.appendChild(pTexto);
            itemDiv.appendChild(spanData);

            // Adiciona ao dropdown
            dropdown.appendChild(itemDiv);
        });
    }

    // --- Atualiza o Badge ---
    if (badge) {
        badge.textContent = contadorNaoLidas;
        badge.style.display = contadorNaoLidas > 0 ? "block" : "none";
    }
}

function formatarData(dataString) {
    if (!dataString) return "";
    // Tenta consertar formato SQL se necessário
    const dataSegura = dataString.replace(" ", "T");
    const dataObj = new Date(dataSegura);
    
    if (isNaN(dataObj)) return dataString;

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    }).format(dataObj);
}