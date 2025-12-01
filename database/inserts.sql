USE db_reporter_do_meu_bairro;

-- ==========================================================
-- 1. TABELAS DE DOMÍNIO (Categorias e Status)
-- ==========================================================

-- Inserindo Status possíveis para uma ocorrência
INSERT INTO tb_status (nome) VALUES 
('Aberto'),
('Em Análise'),
('Em Andamento'),
('Concluído'),
('Cancelado');

-- Inserindo Categorias de problemas urbanos
INSERT INTO tb_categoria (nome) VALUES 
('Iluminação Pública'),
('Buraco na Via'),
('Vazamento de Água/Esgoto'),
('Lixo Irregular'),
('Sinalização de Trânsito'),
('Podas de Árvore');

-- ==========================================================
-- 2. CADASTRO DE CIDADÃOS
-- ==========================================================

INSERT INTO tb_cidadao (nome, email, telefone, cpf, cep, estado, cidade, bairro, rua, complemento, senha) VALUES 
('João da Silva', 'joao.silva@email.com', '11999991234', '12345678901', '01001000', 'SP', 'São Paulo', 'Sé', 'Praça da Sé', 'Apt 12', 'senha_hash_segura_1'),
('Maria Oliveira', 'maria.o@email.com', '21988884321', '98765432100', '20040002', 'RJ', 'Rio de Janeiro', 'Centro', 'Av. Rio Branco', NULL, 'senha_hash_segura_2'),
('Carlos Pereira', 'carlos.dev@email.com', '31977775555', '45678912345', '30130000', 'MG', 'Belo Horizonte', 'Savassi', 'Rua da Bahia', 'Casa 3', 'senha_hash_segura_3');

-- ==========================================================
-- 3. LOCALIZAÇÕES (Onde os problemas ocorreram)
-- ==========================================================

INSERT INTO tb_localizacao (cep, estado, cidade, bairro, rua, numero, complemento) VALUES 
('01310100', 'SP', 'São Paulo', 'Bela Vista', 'Av. Paulista', '1000', 'Em frente ao Masp'),
('22041001', 'RJ', 'Rio de Janeiro', 'Copacabana', 'Rua Barata Ribeiro', '502', NULL),
('30140000', 'MG', 'Belo Horizonte', 'Lourdes', 'Rua Marília de Dirceu', '120', 'Esquina');

-- ==========================================================
-- 4. REGISTRO DE OCORRÊNCIAS
-- ==========================================================
-- Observação: IDs de cidadão, localização e categoria baseados na ordem de inserção acima.

-- Ocorrência 1: João reclama de buraco na Av. Paulista (Categoria 2: Buraco, Loc: 1, Cidadão: 1)
INSERT INTO tb_ocorrencia (descricao, data_registro, avaliacao, compartilhar_dados, id_cidadao, id_localizacao, id_categoria) VALUES 
('Buraco enorme na faixa da direita causando risco de acidentes.', '2023-10-25 08:30:00', NULL, TRUE, 1, 1, 2);

-- Ocorrência 2: Maria reclama de luz queimada (Categoria 1: Iluminação, Loc: 2, Cidadão: 2)
INSERT INTO tb_ocorrencia (descricao, data_registro, avaliacao, compartilhar_dados, id_cidadao, id_localizacao, id_categoria) VALUES 
('Poste de luz apagado há 3 dias. Rua muito escura.', '2023-10-26 19:15:00', NULL, FALSE, 2, 2, 1);

-- Ocorrência 3: Carlos reclama de lixo (Categoria 4: Lixo, Loc: 3, Cidadão: 3) - Já resolvido (com avaliação)
INSERT INTO tb_ocorrencia (descricao, data_registro, avaliacao, compartilhar_dados, id_cidadao, id_localizacao, id_categoria) VALUES 
('Entulho de obra deixado na calçada impedindo passagem.', '2023-10-20 14:00:00', 5, TRUE, 3, 3, 4);

-- ==========================================================
-- 5. TABELAS DEPENDENTES (Multimídia, Histórico, Comentários)
-- ==========================================================

-- Multimídia (Fotos das ocorrências)
INSERT INTO tb_multimidia (link, id_ocorrencia) VALUES 
('https://s3.bucket/fotos/buraco_paulista_01.jpg', 1),
('https://s3.bucket/fotos/buraco_paulista_02.jpg', 1),
('https://s3.bucket/fotos/poste_escuro.jpg', 2);

-- Histórico de Status (Rastreabilidade)
-- Ocorrência 1 (Buraco) - Apenas aberta
INSERT INTO tb_historico_status (data_hora, id_status, id_ocorrencia) VALUES 
('2023-10-25 08:30:00', 1, 1); -- Status: Aberto

-- Ocorrência 2 (Luz) - Aberta e já em análise
INSERT INTO tb_historico_status (data_hora, id_status, id_ocorrencia) VALUES 
('2023-10-26 19:15:00', 1, 2), -- Status: Aberto
('2023-10-27 09:00:00', 2, 2); -- Status: Em Análise

-- Ocorrência 3 (Lixo) - Ciclo completo
INSERT INTO tb_historico_status (data_hora, id_status, id_ocorrencia) VALUES 
('2023-10-20 14:00:00', 1, 3), -- Aberto
('2023-10-21 08:00:00', 3, 3), -- Em Andamento
('2023-10-22 16:00:00', 4, 3); -- Concluído

-- Comentários dos Cidadãos (Interação nas ocorrências)
INSERT INTO tb_comentario_cidadao (conteudo, data_comentada, id_cidadao, id_ocorrencia) VALUES 
('Quase caí de moto nesse buraco, perigoso demais!', '2023-10-25 10:00:00', 3, 1), -- Carlos comentando na ocorrencia do João
('Obrigado pela agilidade na limpeza.', '2023-10-22 17:00:00', 3, 3); -- Carlos comentando na própria ocorrência