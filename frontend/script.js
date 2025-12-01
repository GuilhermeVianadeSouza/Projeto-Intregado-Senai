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

