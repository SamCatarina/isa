CREATE DATABASE IF NOT EXISTS isaData;
USE isaData;

-- Tabela de Perguntas
CREATE TABLE IF NOT EXISTS perguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT,
    alternativa_a TEXT,
    alternativa_b TEXT,
    alternativa_c TEXT,
    alternativa_d TEXT,
    resposta_correta CHAR(1),
    tag_1 VARCHAR(255),
    tag_2 VARCHAR(255),
    tag_3 VARCHAR(255)
);

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    bgcolor VARCHAR(10)
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    material_formato VARCHAR(45) NOT NULL,
    turno VARCHAR(45) NOT NULL,
    bgcolor VARCHAR(10)
);

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    professor_id INT,
    codigo INT NOT NULL UNIQUE,
    bgcolor VARCHAR(45), 
    FOREIGN KEY (professor_id) REFERENCES professores(id)
);

-- Tabela de Associação entre Turmas e Alunos
CREATE TABLE IF NOT EXISTS turma_alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT,
    aluno_id INT,
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

-- Tabela de Listas de Perguntas
CREATE TABLE IF NOT EXISTS listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabela de Associação entre Listas e Perguntas
CREATE TABLE IF NOT EXISTS lista_perguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lista_id INT,
    pergunta_id INT,
    FOREIGN KEY (lista_id) REFERENCES listas(id),
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
);

-- Tabela de Associação entre Turmas e Listas
CREATE TABLE IF NOT EXISTS turma_listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT,
    lista_id INT,
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (lista_id) REFERENCES listas(id)
);

-- Tabela de Respostas
CREATE TABLE IF NOT EXISTS respostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT,
    pergunta_id INT,
    lista_id INT,
    resposta CHAR(1),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(id),
    FOREIGN KEY (lista_id) REFERENCES listas(id)
);

-- Tabela de Resultados das Listas
CREATE TABLE IF NOT EXISTS resultado_listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    lista_id INT NOT NULL,
    tags TEXT,
    tagCons TEXT,
    turno VARCHAR(45),
    score INT,
    formato VARCHAR(255),
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (lista_id) REFERENCES listas(id)
);


-- Tabela de Referências
CREATE TABLE IF NOT EXISTS referencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT NOT NULL,
    ref TEXT,
    tag VARCHAR(255),
    formato VARCHAR(255),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


-- Tabela de Grupos
CREATE TABLE IF NOT EXISTS grupos_AG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    lista_id INT NOT NULL,
    grupo_id INT NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (lista_id) REFERENCES listas(id)
);

-- Tabela de Chamada
CREATE TABLE IF NOT EXISTS chamada_API (
    id INT AUTO_INCREMENT PRIMARY KEY,
    acao_chamada BOOLEAN NOT NULL,
    turma_id INT NOT NULL,
    lista_id INT NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES turmas(id),
    FOREIGN KEY (lista_id) REFERENCES listas(id)
);