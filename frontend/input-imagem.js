'use strict'

export function limitarQuantidadeDeArquivos() {
    const input = document.getElementById('imagem');

    input.addEventListener('change', () => {
        if (input.files.length > 5) {
            alert('Você pode selecionar no máximo 5 imagens.');
            input.value = ""; // limpa a seleção
        }
    });
}
