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
  const loginContainer = document.getElementById('login') // Pega o container #login

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

  // Lógica para o container #login
  if (loginContainer) {
    if (tabId === 'aba-login') {
        loginContainer.style.display = 'flex'; // Visível apenas para login
    } else {
        loginContainer.style.display = 'none'; // Oculto para todas as outras abas, incluindo cadastro
    }
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
const formLocalizacaoOriginal = document.querySelector('#aba-escolherLocal .form-container')

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

    const cep = target.value.replace(/\D/g, '');

    if (cepValido(cep)) {
        const infoCep = await pesquisarCep(cep);

        if (infoCep.erro) {
            alert('CEP não encontrado ou inválido.');
        } else {
            document.getElementById('endereco').value = infoCep.logradouro;
            document.getElementById('bairro').value = infoCep.bairro;
            document.getElementById('cidade').value = infoCep.localidade;
            document.getElementById('estado').value = infoCep.uf;

            // Bloqueia a edição dos campos preenchidos
            const fields = ['endereco', 'bairro', 'cidade', 'estado'];
            fields.forEach(id => {
                document.getElementById(id).setAttribute('readonly', 'readonly');
            });
        }
    } else if (target.value.length > 0) {
        alert('CEP inválido! O CEP deve conter 8 dígitos numéricos.');
    }
}

// Adiciona listener de focusout no campo CEP
const inputCep = document.getElementById('CEP');
if (inputCep) {
    inputCep.addEventListener('focusout', preencherCampos);
}

// O bloco de código do formLocalizacao original foi movido e modificado acima para suportar o retorno para a aba de cadastro.
// O código abaixo é apenas para manter a estrutura do arquivo, mas a lógica foi consolidada.

// LÓGICA DA ABA-VERPOST
const abaVerPost = document.getElementById('aba-verPost');
const posts = document.querySelectorAll('.post');

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
        abaVerPost.classList.remove('active');
    }
});

// NAVEGAÇÃO LOGIN/CADASTRO
const linkSignup = document.getElementById('link-signup');
const linkVoltarLogin = document.getElementById('link-voltar-login');

if (linkSignup) {
    linkSignup.addEventListener('click', (e) => {
        e.preventDefault();
        showTab('aba-cadastro');
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

        const nome = document.getElementById('cadastro-nome').value.trim();
        const email = document.getElementById('cadastro-email').value.trim();
        const senha = document.getElementById('cadastro-senha').value.trim();
        const telefone = document.getElementById('cadastro-telefone').value.trim();
        const localizacao = document.getElementById('cadastro-localizacao').value.trim();

        if (nome && email && senha && telefone && localizacao) {
            // Simulação de cadastro bem-sucedido
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            formCadastro.reset();
            showTab('aba-login');
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });
}


// LOGIN
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        if (email === 'teste@gmail.com' && senha === '12345') {
            showTab('aba-home')
            login.style.display = 'none'
        } else {
            alert('Email ou senha incorretos')
        }
    });
}