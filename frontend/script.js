'use strict'

import { criarOcorrencias } from "./obter-ocorrencias-cidadao.js"
import { criarOcorrenciasComunidade} from "./obter-ocorrencias.js"
import { CriarNovaOcorrencia } from "./criar-ocorrencia.js";
import { criarDropBoxCategorias } from "./obter-ocorrencias.js";
import { aplicarFiltrosCompletos } from "./obter-ocorrencias.js";
import { configurarListenerDeFiltro } from "./obter-ocorrencias.js";
import { obterIdCidadao } from "./logar-cidadao.js";


criarOcorrenciasComunidade()
await criarDropBoxCategorias(document.getElementById('categoria-select'))
await criarDropBoxCategorias(document.getElementById('categoria'))
aplicarFiltrosCompletos()
configurarListenerDeFiltro()

const user = JSON.parse(localStorage.getItem('user'))

criarOcorrencias(Number(user.id))

document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value
  const senha = document.getElementById('senha').value

  const cidadaoId = await obterIdCidadao(email, senha)

  if (cidadaoId.status_code == 400) {
    alert('Email ou senha incorretos')
  } else {
    localStorage.setItem('user', JSON.stringify({ id: cidadaoId.cidadao[0].id, isAnonymous: false }))
    showTab('aba-home')
    // A variável 'login' não está definida, removendo a linha
    // login.style.display = 'none'
  }
})

// Documento HTML inicial carregado
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    showTab('aba-home')
  } else {
    showTab('aba-login')
  }
});

// Função para alternar entre abas
function showTab(tabId) {
  // Pega todas as abas
  const todasAsAbas = document.querySelectorAll('.aba')
  const footer = document.getElementById('footer')

  // Pega os wrappers de login e cadastro
  const loginWrapper = document.getElementById('login-wrapper')
  const cadastroWrapper = document.getElementById('cadastro-wrapper')

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

  // Lógica para os containers de login e cadastro
  if (loginWrapper) {
    loginWrapper.style.display = (tabId === 'aba-login') ? 'flex' : 'none'
  }

  if (cadastroWrapper) {
    cadastroWrapper.style.display = (tabId === 'aba-cadastro') ? 'flex' : 'none'
  }

  // Lógica para o footer
  if (tabId === 'aba-login' || tabId === 'aba-cadastro' || tabId === 'aba-escolherLocal') {
    footer.style.display = 'none' // Oculto para login, cadastro e escolherLocal
  } else {
    footer.style.display = 'grid' // Visível para as outras abas
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

function limparDadosLocalizacao() {
  document.getElementById('form-localizacao').reset()
  document.getElementById('btn-localizacao-ocorrencia').textContent = 'Escolher localização'
  delete document.getElementById('btn-localizacao-ocorrencia').dataset.localizacao
}

// Botão de criar ocorrência
const buttonCriar = document.getElementById('btn-criar')
if (buttonCriar) {
  buttonCriar.addEventListener('click', () => {
    limparDadosLocalizacao()
    showTab('aba-criar')
  });
}

const buttonCancelar = document.getElementById('btn-cancelar-local')
if (buttonCancelar) {
  buttonCancelar.addEventListener('click', () => {
    limparDadosLocalizacao()
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
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAnonymous) {
      if (confirm('Deseja fazer login para continuar?')) {
        showTab('aba-login');
      }
    } else {
      showTab('aba-perfil');
    }
  });
}

// BOTÕES DE PERFIL
const buttonNovaOcorrencia = document.getElementById('buttonNovaOcorrencia')
if (buttonNovaOcorrencia) {
  buttonNovaOcorrencia.addEventListener('click', () => {
    limparDadosLocalizacao()
    showTab('aba-criar')
  })
}

const buttonVerOcorrencias = document.getElementById('btn-verOcorrencias')
if (buttonVerOcorrencias) {
  buttonVerOcorrencias.addEventListener('click', () => {
    showTab('aba-minhasOcorrencias')
  })
}

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('user');
    showTab('aba-login');
  });
}

// FORMULÁRIO DE CRIAR OCORRÊNCIA
const formOcorrencia = document.getElementById('form-ocorrencia')

if (formOcorrencia) {
  // Validação do formulário
  formOcorrencia.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const categoria = document.getElementById('categoria').value
    const descricao = document.getElementById('descricao').value.trim()
    const localizacao = JSON.parse(document.getElementById('btn-localizacao-ocorrencia').dataset.localizacao)
    let compartilharDados

    const anonimo = document.getElementById('anonimo');

    if (anonimo.checked) {
      compartilharDados = false
    } else {
      compartilharDados = true
    }

    const ocorrencia = {
      descricao: descricao,
      avaliacao: 1,
      compartilhar_dados: compartilharDados,
      id_cidadao: 1,
      id_categoria: Number(categoria),
      multimidia: [
        {
          link: "https://bucket-s3.exemplo.com/evidencias/foto_01.jpg"
        }
      ],
      localizacao: localizacao
    }

    try {
      await CriarNovaOcorrencia(ocorrencia)
      alert('Ocorrência publicada com sucesso!')
    } catch (error) {
      alert('Ocorreu um erro ao publicar a ocorrência!')
      console.log(error);
    }


    formOcorrencia.reset()

    showTab('aba-home')
  })
}

// POP-UP DE CANCELAMENTO

const btnCancelarForm = document.querySelector('.btn-cancelar')
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
const btnEscolherLocalizacao = document.getElementById('btn-localizacao-ocorrencia')
const btnVoltarLocalizacao = document.getElementById('Voltar')
const btnManual = document.getElementById('btn-manual')

// Abre o pop-up ao clicar em "Escolher localização"
if (btnEscolherLocalizacao) {
  btnEscolherLocalizacao.addEventListener('click', (e) => {
    e.preventDefault()
    abrirPopUp('popUp-localizacao')
  })
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

// Botão Continuar na aba-escolherLocal
const btnContinuarLocal = document.querySelector('#aba-escolherLocal .btn-submit')

if (btnContinuarLocal) {
  btnContinuarLocal.addEventListener('click', (e) => {
    e.preventDefault()

    // 1. Coletar os dados de localização
    const cep = document.getElementById('CEP').value.trim()
    const endereco = document.getElementById('endereco').value.trim()
    const numero = document.getElementById('numero').value.trim()
    const bairro = document.getElementById('bairro').value.trim()
    const cidade = document.getElementById('cidade').value.trim()
    const estado = document.getElementById('estado').value.trim()
    const complemento = document.getElementById('complemento').value.trim()

    // 2. Validar se os campos obrigatórios estão preenchidos
    if (!cep || !endereco || !bairro || !cidade || !estado) {
      alert('Por favor, preencha todos os campos de localização.')
      return
    }

    // 3. Salvar os dados (Simulação: Armazenar em dataset)
    const numeroString = numero.length > 0 ? `${numero}, ` : ''
    const localizacaoString = `${endereco}, ${numeroString}${bairro}, ${cidade}-${estado}, CEP: ${cep}`

    const localizacaoJSON = {
      cep: cep,
      estado: estado,
      cidade: cidade,
      bairro: bairro,
      rua: endereco,
      numero: numero == '' ? null : numero,
      complemento: complemento == '' ? null : complemento
    }

    // Preencher o campo de localização na aba-criar
    const inputLocalizacaoOcorrencia = document.getElementById('btn-localizacao-ocorrencia')
    if (inputLocalizacaoOcorrencia) {
      inputLocalizacaoOcorrencia.textContent = localizacaoString
      inputLocalizacaoOcorrencia.dataset.localizacao = JSON.stringify(localizacaoJSON)
    }

    // 4. Navegar para a aba de nova ocorrência (aba-criar)
    showTab('aba-criar')
  })
}

// Lógica ViaCEP (Refatorada)
const limparFormulario = () => {
  const fields = ['endereco', 'bairro', 'cidade', 'estado']
  fields.forEach(id => {
    const element = document.getElementById(id)
    element.value = ''
    element.removeAttribute('readonly') // Remove o bloqueio para permitir nova busca
  });
}

const cepValido = (cep) => cep.length == 8 && /^[0-9]+$/.test(cep);

async function pesquisarCep(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    // Retorna um objeto com erro em caso de falha na requisição
    return { erro: true, message: 'Erro de conexão.' }
  }
}

async function preencherCampos({ target }) {
  limparFormulario();

  const cep = target.value.replace(/\D/g, '')

  if (cepValido(cep)) {
    const infoCep = await pesquisarCep(cep)

    if (infoCep.erro) {
      alert('CEP não encontrado ou inválido.')
    } else {
      document.getElementById('endereco').value = infoCep.logradouro
      document.getElementById('bairro').value = infoCep.bairro
      document.getElementById('cidade').value = infoCep.localidade
      document.getElementById('estado').value = infoCep.uf

      // Bloqueia a edição dos campos preenchidos
      const fields = ['endereco', 'bairro', 'cidade', 'estado']
      fields.forEach(id => {
        document.getElementById(id).setAttribute('readonly', 'readonly')
      });
    }
  } else if (target.value.length > 0) {
    alert('CEP inválido! O CEP deve conter 8 dígitos numéricos.')
  }
}

// Adiciona listener de focusout no campo CEP
const inputCep = document.getElementById('CEP')
if (inputCep) {
  inputCep.addEventListener('focusout', preencherCampos)
}

// LÓGICA DA ABA-VERPOST
const abaVerPost = document.getElementById('aba-verPost')
const posts = document.querySelectorAll('.post')

// Adiciona listener de clique a todos os posts
posts.forEach(post => {
  post.addEventListener('click', () => {
    // Apenas mostra a aba-verPost
    abaVerPost.classList.add('active')
  });
});

// Adiciona listener de clique para fechar a aba-verPost ao clicar no fundo
if (abaVerPost) {
  abaVerPost.addEventListener('click', (e) => {
    // Verifica se o clique foi no próprio abaVerPost (fundo escuro) e não em um de seus filhos
    if (e.target === abaVerPost) {
      abaVerPost.classList.remove('active')
    }
  });
}

// LÓGICA DA CLASSIFICAÇÃO
const btnSucesso = document.getElementById('btn-sucesso');
const btnNaoSucesso = document.getElementById('btn-nao-sucesso');
const classificacaoFeedback = document.getElementById('classificacao-feedback');
const classificacaoButtons = document.querySelector('.classificacao-buttons');

if (btnSucesso && btnNaoSucesso && classificacaoFeedback) {
    btnSucesso.addEventListener('click', () => {
        classificacaoFeedback.textContent = 'Resolvido';
        classificacaoFeedback.classList.add('status-resolvido');
        classificacaoFeedback.classList.remove('status-nao-resolvido');
        classificacaoButtons.style.display = 'none';
    });

    btnNaoSucesso.addEventListener('click', () => {
        classificacaoFeedback.textContent = 'Não Resolvido';
        classificacaoFeedback.classList.add('status-nao-resolvido');
        classificacaoFeedback.classList.remove('status-resolvido');
        classificacaoButtons.style.display = 'none';
    });
}


// NAVEGAÇÃO LOGIN/CADASTRO
const linkSignup = document.getElementById('link-signup')
const linkVoltarLogin = document.getElementById('link-voltar-login')

if (linkSignup) {
  linkSignup.addEventListener('click', (e) => {
    e.preventDefault()
    showTab('aba-cadastro')
  });
}

if (linkVoltarLogin) {
  linkVoltarLogin.addEventListener('click', (e) => {
    e.preventDefault()
    showTab('aba-login')
  });
}

// FORMULÁRIO DE CADASTRO
const formCadastro = document.getElementById('form-cadastro')

if (formCadastro) {
  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('cadastro-nome').value.trim()
    const email = document.getElementById('cadastro-email').value.trim()
    const senha = document.getElementById('cadastro-senha').value.trim()
    const telefone = document.getElementById('cadastro-telefone').value.trim()
    const localizacao = document.getElementById('cadastro-localizacao').value.trim()

    if (nome && email && senha && telefone && localizacao) {
      // Simulação de cadastro bem-sucedido
      alert('Cadastro realizado com sucesso! Faça login para continuar.')
      formCadastro.reset();
      showTab('aba-login');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.')
    }
  });
}

// LOGIN

// Botão Entrar como anonimo
const btnAnonimo = document.getElementById('anonimo');
if (btnAnonimo) {
  btnAnonimo.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ isAnonymous: true }));
    showTab('aba-home');
  });
}

// --- Lógica de Geolocalização Automática (Simplificada) ---

const btnAuto = document.getElementById('btn-auto')

if (btnAuto) {
  btnAuto.addEventListener('click', () => {
    fecharPopUp('popUp-localizacao');
    // Apenas mostra a aba de escolha manual, pois a geocodificação reversa está falhando
    showTab('aba-escolherLocal');
    alert("Não foi possível obter sua localização automaticamente. Por favor, preencha manualmente.")
  });
}

// Filtro de pesquisa de localização
const inputLocalizacao = document.getElementById('localizacao-select')


function removerAcentos(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

inputLocalizacao.addEventListener('keyup', () => {
  const filtro = removerAcentos(inputLocalizacao.value.toLowerCase())
  const cards = document.querySelectorAll('.post')

  cards.forEach(card => {
    const pLoc = card.querySelector('.post-loc')

    const texto = removerAcentos(pLoc.textContent.toLowerCase())

    if (texto.includes(filtro)) {
      card.style.display = 'block'
    } else {
      card.style.display = 'none'
    }
  })
})

// Chama a função ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  // Adiciona listener para a seleção de localização
  const selectLocalizacao = document.getElementById('localizacao-select')
  if (selectLocalizacao) {
    selectLocalizacao.addEventListener('change', (e) => {
      const novaLocalizacao = e.target.value
    })
  }
})

// maximo de caracter
const descricaoTextarea = document.getElementById('descricao')
const charCountDisplay = document.getElementById('char-count')
const maxChars = 1000

if (descricaoTextarea && charCountDisplay) {
  descricaoTextarea.addEventListener('input', () => {
    const currentChars = descricaoTextarea.value.length
    charCountDisplay.textContent = `${currentChars}/${maxChars}`
  });
}
