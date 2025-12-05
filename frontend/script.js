'use strict'

// Documento HTML inicial carregado
document.addEventListener('DOMContentLoaded', () => {
    showTab('aba-login');
});

// Função para alternar entre abas
function showTab(tabId) {
  // Pega todas as abas
  const todasAsAbas = document.querySelectorAll('.aba')
  const footer = document.getElementById('footer')

  // Remove a classe 'active' (esconde)
  todasAsAbas.forEach(aba => {
    aba.classList.remove('active')
  });

  // Pega a aba selecionada pelo ID tabId
  const abaAtiva = document.getElementById(tabId)

  // Adiciona a classe 'active' apenas na aba selecionada (mostra ela)
  if (abaAtiva) {
    abaAtiva.classList.add('active')
  }

  // Esconde o footer nas abas de login e cadastro
  if (tabId === 'aba-login' || tabId === 'aba-cadastro') {
    footer.style.display = 'none'
  } else {
    footer.style.display = 'flex'
  }
}


// Função para fechar popups
function fecharPopUp(popUpId) {
  const popUp = document.getElementById(popUpId)
  if (popUp) {
    popUp.classList.remove('active')
    popUp.style.display = 'none'
  }
}

// Função para abrir popups
function abrirPopUp(popUpId) {
  const popUp = document.getElementById(popUpId)
  if (popUp) {
    popUp.classList.add('active')
    popUp.style.display = 'flex'
  }
}


// Botão de criar ocorrência
const buttonCriar = document.getElementById('btn-criar')
if (buttonCriar) {
  buttonCriar.addEventListener('click', () => {
    showTab('aba-criar')
  });
}

// Botão de home (comunidade)
const buttonHome = document.getElementById('btn-home')
if (buttonHome) {
  buttonHome.addEventListener('click', () => {
    showTab('aba-home')
  })
}

// Botão de perfil
const buttonPerfil = document.getElementById('btn-perfil')
if (buttonPerfil) {
  buttonPerfil.addEventListener('click', () => {
    showTab('aba-perfil')
  });
}


// BOTÕES DE PERFIL
const buttonNovaOcorrencia = document.getElementById('buttonNovaOcorrencia')
if (buttonNovaOcorrencia) {
  buttonNovaOcorrencia.addEventListener('click', () => {
    showTab('aba-criar')
  })
}

const buttonVerOcorrencias = document.getElementById('btn-verOcorrencias')
if (buttonVerOcorrencias) {
  buttonVerOcorrencias.addEventListener('click', () => {
    showTab('aba-minhasOcorrencias')
  })
}

// FORMULÁRIO DE CRIAR OCORRÊNCIA
const formOcorrencia = document.getElementById('form-ocorrencia')

if (formOcorrencia) {
  // Validação do formulário
  formOcorrencia.addEventListener('submit', (evento) => {
    evento.preventDefault()

    // Validar campos obrigatórios
    const titulo = document.getElementById('titulo').value.trim()
    const categoria = document.getElementById('categoria').value
    const descricao = document.getElementById('descricao').value.trim()

    if (!titulo) {
      alert('Por favor, preencha o título do problema')
      return
    }

    if (!categoria) {
      alert('Por favor, selecione uma categoria')
      return
    }

    if (!descricao) {
      alert('Por favor, preencha a descrição do problema')
      return
    }

    // Se passou na validação
    alert('Ocorrência publicada com sucesso!')

    formOcorrencia.reset()

    showTab('aba-home')
  })
}

// POP-UP DE CANCELAMENTO

const btnCancelarForm = document.querySelector('.btn-cancelar')
const popUpCancelar = document.getElementById('popUp-cancelar')
const btnSim = document.getElementById('btn-sim')
const btnNao = document.getElementById('btn-nao')

if (btnCancelarForm) {
  btnCancelarForm.addEventListener('click', (e) => {
    e.preventDefault()
    // Exibe o pop-up
    abrirPopUp('popUp-cancelar')
  })
}

// Botão "Sim" no pop-up de cancelamento
if (btnSim) {
  btnSim.addEventListener('click', () => {
    // Fecha o pop-up
    fecharPopUp('popUp-cancelar')

    // Limpa o formulário
    if (formOcorrencia) {
      formOcorrencia.reset()
    }

    // Volta para home
    showTab('aba-home')
  })
}

// Botão "Não" no pop-up de cancelamento
if (btnNao) {
  btnNao.addEventListener('click', () => {
    // Fecha o pop-up
    fecharPopUp('popUp-cancelar')
  })
}


// POP-UP DE LOCALIZAÇÃO
const btnEscolherLocalizacao = document.querySelector('.btn-local')
const popUpLocalizacao = document.getElementById('popUp-localizacao')
const btnVoltarLocalizacao = document.getElementById('Voltar')
const btnManual = document.getElementById('btn-manual')
const btnAuto = document.getElementById('btn-auto')

// Abre o pop-up ao clicar em "Escolher localização"
if (btnEscolherLocalizacao) {
  btnEscolherLocalizacao.addEventListener('click', (e) => {
    e.preventDefault()
    abrirPopUp('popUp-localizacao')
  });
}


// Botão "Escolher Manualmente"
if (btnManual) {
  btnManual.addEventListener('click', () => {
    showTab('aba-escolherLocal')
    fecharPopUp('popUp-localizacao')
  })
}

// Botão "Voltar" no pop-up de localização
if (btnVoltarLocalizacao) {
  btnVoltarLocalizacao.addEventListener('click', () => {
    fecharPopUp('popUp-localizacao')
  })
}


// FORMULÁRIO DE LOCALIZAÇÃO MANUAL
const formLocalizacao = document.querySelector('#aba-escolherLocal .form-container')

if (formLocalizacao) {
  const btnContinuar = formLocalizacao.querySelector('.btn-submit')
  const btnCancelarLocal = formLocalizacao.querySelector('.btn-cancelar')

  if (btnContinuar) {
    btnContinuar.addEventListener('click', (e) => {
      e.preventDefault()

      // Validar campos
      const cep = document.getElementById('CEP').value.trim()
      const endereco = document.getElementById('endereco').value.trim()
      const numero = document.getElementById('numero').value.trim()
      const bairro = document.getElementById('bairro').value.trim()
      const cidade = document.getElementById('cidade').value.trim()
      const estado = document.getElementById('estado').value.trim()

      if (!cep || !endereco || !numero || !bairro || !cidade || !estado) {
        alert('Por favor, preencha todos os campos de localização')
        return
      }

      // Se passou na validação
      alert(`Localização salva: ${endereco}, ${numero}, ${bairro}, ${cidade}-${estado}`)

      // Volta para o formulário de criar ocorrência
      showTab('aba-criar')
    })
  }

  if (btnCancelarLocal) {
    btnCancelarLocal.addEventListener('click', (e) => {
      e.preventDefault()
      // formLocalizacao.reset() // Esta linha foi removida pois causava um erro.
      showTab('aba-criar')
    })
  }
}