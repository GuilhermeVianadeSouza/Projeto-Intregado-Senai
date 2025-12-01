'use strict'
// BOTÕES DE NAVEGAÇÃO
// botão de criar ocorrência
const buttonCriar = document.getElementById('btn-criar')
buttonCriar.addEventListener('click', () => {
  showTab('aba-criar')
});

// botão de home (comunidade)
const buttonHome = document.getElementById('btn-home')
buttonHome.addEventListener('click', () => {
  showTab('aba-home')
})

// Botão de perfil
const buttonPerfil = document.getElementById('btn-perfil')
buttonPerfil.addEventListener('click', () => {
  showTab('aba-perfil')
});




// Função para alternar entre abas
function showTab(tabId) {
  // Pega todas as abas
  const todasAsAbas = document.querySelectorAll('.aba')
  
  //  remove a classe 'active' (esconde)
  todasAsAbas.forEach(aba => {
    aba.classList.remove('active')
  });
  
  // pega a aba selecionada pelo ID tabID
  const abaAtiva = document.getElementById(tabId)
  
  // Adiciona a classe 'active' apenas na aba selecionada (mostra ela)
  abaAtiva.classList.add('active')
  
  // Pega o elemento do nav (barra de filtros)
  const nav = document.getElementById('nav-principal')
  
}




// formulario criar ocorrecia 
const formOcorrencia = document.getElementById('form-ocorrencia')

if (formOcorrencia) {
  // clicou no botão enviar
  formOcorrencia.addEventListener('submit', (evento) => {
    alert('Ocorrência publicada!')
    
    // limpa todos os campos 
    formOcorrencia.reset()
    // quando enviar a ocorrencia volta para a aba de home
    showTab('aba-home')
  })
}


// POP-UP CANCELAR  
const btnCancelar = document.querySelector('.btn-cancelar')
const popUpCancelar = document.getElementById('popUp-cancelar')
const btnSim = document.getElementById('btn-sim')
const btnNao = document.getElementById('btn-nao')

if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
        // Exibe o pop-up
        popUpCancelar.style.display = 'flex'
    })
}

// Botão "Sim" no pop-up
btnSim.addEventListener('click', () => {
    // Fecha o pop-up e limpa o formulário
    popUpCancelar.style.display = 'none'
    const formOcorrencia = document.getElementById('form-ocorrencia')
    if (formOcorrencia) {
        formOcorrencia.reset()
    }
    showTab('aba-home')
})

// Botão "Não" no pop-up
btnNao.addEventListener('click', () => {
    // Fecha o pop-up
    popUp.style.display = 'none'
})

// POP-UP LOCALIZAÇÃO
const btnLocal = document.getElementById('btn-local')
const popUpLocal= document.getElementById('popUp-localizacao')

if (btnLocal) {
    btnLocal.addEventListener('click', () => {
        // Exibe o pop-up
        popUpLocal.style.display = 'flex'
    })
}