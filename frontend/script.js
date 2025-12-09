'use strict'

import { criarOcorrencias } from "./obter-ocorrencias-cidadao.js"
import { criarOcorrenciasComunidade } from "./obter-ocorrencias.js"

criarOcorrencias()
criarOcorrenciasComunidade()

// Documento HTML inicial carregado
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        showTab('aba-home');
    } else {
        showTab('aba-login');
    }
});

// Função para alternar entre abas
function showTab(tabId) {
  // Pega todas as abas
  const todasAsAbas = document.querySelectorAll('.aba')
  const footer = document.getElementById('footer')

  // Pega os wrappers de login e cadastro
  const loginWrapper = document.getElementById('login-wrapper');
  const cadastroWrapper = document.getElementById('cadastro-wrapper');

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
    loginWrapper.style.display = (tabId === 'aba-login') ? 'flex' : 'none';
  }

  if (cadastroWrapper) {
    cadastroWrapper.style.display = (tabId === 'aba-cadastro') ? 'flex' : 'none';
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


// Botão de criar ocorrência
const buttonCriar = document.getElementById('btn-criar')
if (buttonCriar) {
  buttonCriar.addEventListener('click', () => {
    showTab('aba-criar')
  });
}

const buttonCancelar = document.getElementById('btn-cancelar-local')
if (buttonCancelar) {
  buttonCancelar.addEventListener('click', () => {
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
const btnEscolherLocalizacao = document.getElementById('btn-localizacao-ocorrencia')
const popUpLocalizacao = document.getElementById('popUp-localizacao')
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


// FORMULÁRIO DE LOCALIZAÇÃO MANUAL
const formLocalizacaoOriginal = document.querySelector('#aba-escolherLocal .form-container')

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

        // 2. Validar se os campos obrigatórios estão preenchidos
        if (!cep || !endereco || !numero || !bairro || !cidade || !estado) {
            alert('Por favor, preencha todos os campos de localização.')
            return
        }

        // 3. Salvar os dados (Simulação: Armazenar em uma variável global ou localStorage)
        // Como não há um backend, vamos simular o salvamento e preencher o campo na aba-criar
        const localizacaoCompleta = `${endereco}, ${numero}, ${bairro}, ${cidade}-${estado}, CEP: ${cep}`

        // Preencher o campo de localização na aba-criar
        const inputLocalizacaoOcorrencia = document.getElementById('btn-localizacao-ocorrencia')
        if (inputLocalizacaoOcorrencia) {
            inputLocalizacaoOcorrencia.textContent = localizacaoCompleta
            inputLocalizacaoOcorrencia.dataset.localizacao = localizacaoCompleta // Armazena o valor completo
        }

        // 4. Navegar para a aba de nova ocorrência (aba-criar)
        showTab('aba-criar')
    })
}

// Lógica ViaCEP (Refatorada)
const limparFormulario = () => {
    const fields = ['endereco', 'bairro', 'cidade', 'estado'];
    fields.forEach(id => {
        const element = document.getElementById(id);
        element.value = '';
        element.removeAttribute('readonly'); // Remove o bloqueio para permitir nova busca
    });
}

const cepValido = (cep) => cep.length == 8 && /^[0-9]+$/.test(cep);

async function pesquisarCep(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        // Retorna um objeto com erro em caso de falha na requisição
        return { erro: true, message: 'Erro de conexão.' };
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
        abaVerPost.classList.add('active');
    });
});

// Adiciona listener de clique para fechar a aba-verPost ao clicar no fundo
abaVerPost.addEventListener('click', (e) => {
    // Verifica se o clique foi no próprio abaVerPost (fundo escuro) e não em um de seus filhos
    if (e.target === abaVerPost) {
        abaVerPost.classList.remove('active')
    }
});

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
        e.preventDefault();
        showTab('aba-login');
    });
}

// FORMULÁRIO DE CADASTRO
const formCadastro = document.getElementById('form-cadastro');

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
const formLogin = document.getElementById('form-login')
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value
        const senha = document.getElementById('senha').value

        if (email === 'teste@gmail.com' && senha === '12345') {
            localStorage.setItem('user', JSON.stringify({ email: email, name: 'Victor Hugo' }));
            showTab('aba-home')
            login.style.display = 'none'
        } else {
            alert('Email ou senha incorretos')
        }
    })
}

// --- Lógica de Geolocalização Automática (Simplificada) ---

const btnAuto = document.getElementById('btn-auto')

if (btnAuto) {
  btnAuto.addEventListener('click', () => {
    fecharPopUp('popUp-localizacao');
    // Apenas mostra a aba de escolha manual, pois a geocodificação reversa está falhando
    showTab('aba-escolherLocal');
    alert("Não foi possível obter sua localização automaticamente. Por favor, preencha manualmente.");
  });
}

// Array de cidades/estados para o seletor da comunidade
const cidadesDisponiveis = [
    { cidade: "Carapicuíba", estado: "SP" },
    { cidade: "Osasco", estado: "SP" },
    { cidade: "Barueri", estado: "SP" },
    { cidade: "São Paulo", estado: "SP" },
    { cidade: "Rio de Janeiro", estado: "RJ" },
];

// Função para preencher o seletor de localização
function preencherSeletorLocalizacao() {
    const selectLocalizacao = document.getElementById('localizacao-select');
    if (selectLocalizacao) {
        // Limpa as opções existentes (exceto a primeira "Selecione...")
        while (selectLocalizacao.options.length > 1) {
            selectLocalizacao.remove(1);
        }

        cidadesDisponiveis.forEach(local => {
            const option = document.createElement('option');
            option.value = `${local.cidade}-${local.estado}`;
            option.textContent = `${local.cidade}-${local.estado}`;
            selectLocalizacao.appendChild(option);
        });

        // Define um valor padrão (ex: Carapicuíba-SP)
        selectLocalizacao.value = "Carapicuíba-SP";
    }
}

// Chama a função ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    preencherSeletorLocalizacao();

    // Adiciona listener para a seleção de localização
    const selectLocalizacao = document.getElementById('localizacao-select');
    if (selectLocalizacao) {
        selectLocalizacao.addEventListener('change', (e) => {
            const novaLocalizacao = e.target.value;
            console.log('Nova localização selecionada para a comunidade:', novaLocalizacao);
            // Aqui seria implementada a lógica de filtragem dos posts da comunidade
            // Por enquanto, apenas registramos a mudança.
            alert(`Comunidade filtrada para: ${novaLocalizacao}`);
        });
    }
});

