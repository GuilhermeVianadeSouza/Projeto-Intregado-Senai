CREATE DATABASE db_reporter_do_meu_bairro;

USE db_reporter_do_meu_bairro;

CREATE TABLE tb_cidadao(
id INT PRIMARY KEY auto_increment NOT NULL,
nome VARCHAR(120) NOT NULL,
email VARCHAR(254) NOT NULL,
telefone VARCHAR(11) NOT NULL,
cpf VARCHAR(11) NOT NULL,
cep VARCHAR(8) NOT NULL,
estado VARCHAR(2) NOT NULL,
cidade VARCHAR(120) NOT NULL,
bairro VARCHAR(150) NOT NULL,
rua VARCHAR(200) NOT NULL,
complemento VARCHAR(20) NULL,
senha VARCHAR(64) NOT NULL);

CREATE TABLE tb_localizacao(
id INT PRIMARY KEY auto_increment NOT NULL,
cep VARCHAR(8) NULL,
estado VARCHAR(2) NOT NULL,
cidade VARCHAR(120) NOT NULL,
bairro VARCHAR(150) NOT NULL,
rua VARCHAR(200) NOT NULL,
numero VARCHAR(20) NULL,
complemento VARCHAR(20) NULL);

CREATE TABLE tb_categoria(
id INT PRIMARY KEY auto_increment NOT NULL,
nome VARCHAR(30) NOT NULL);

CREATE TABLE tb_status(
id INT PRIMARY KEY auto_increment NOT NULL,
nome VARCHAR(20) NOT NULL);

CREATE TABLE tb_ocorrencia(
id INT PRIMARY KEY auto_increment NOT NULL,
descricao VARCHAR(1000) NOT NULL,
data_registro DATETIME NOT NULL,
avaliacao INT NULL,
compartilhar_dados BOOLEAN,
id_cidadao INT NOT NULL,
id_localizacao INT NOT NULL,
id_categoria INT NOT NULL,
FOREIGN KEY (id_cidadao) REFERENCES tb_cidadao(id),
FOREIGN KEY (id_localizacao) REFERENCES tb_localizacao(id),
FOREIGN KEY (id_categoria) REFERENCES tb_categoria(id)
);

CREATE TABLE tb_multimidia(
id INT PRIMARY KEY auto_increment NOT NULL,
link VARCHAR(256) NOT NULL,
id_ocorrencia INT NOT NULL,
FOREIGN KEY (id_ocorrencia) REFERENCES tb_ocorrencia(id)
);

CREATE TABLE tb_historico_status(
id INT PRIMARY KEY auto_increment NOT NULL,
data_hora DATETIME NOT NULL,
id_status INT NOT NULL,
id_ocorrencia INT NOT NULL,
FOREIGN KEY (id_status) REFERENCES tb_status(id),
FOREIGN KEY (id_ocorrencia) REFERENCES tb_ocorrencia(id)
);

CREATE TABLE tb_comentario_cidadao(
id INT PRIMARY KEY auto_increment NOT NULL,
conteudo VARCHAR(500) NOT NULL,
data_comentada DATETIME NOT NULL,
id_cidadao INT NOT NULL,
id_ocorrencia INT NOT NULL,
FOREIGN KEY (id_cidadao) REFERENCES tb_cidadao(id),
FOREIGN KEY (id_ocorrencia) REFERENCES tb_ocorrencia(id)
);