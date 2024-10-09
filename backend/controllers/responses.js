import { db } from "../db.js";


export const saveAnswers = (req, res) => {
  const { alunoId, listaId, respostas } = req.body;

  const query =
    "INSERT INTO respostas (pergunta_id, resposta, aluno_id, lista_id) VALUES ?";

  const values = respostas.map((resposta) => [
    resposta.perguntaId,
    resposta.respostaAluno,
    alunoId,
    listaId,
  ]);


  db.query(query, [values], (err, data) => {
    if (err) {
      console.error("Erro ao salvar respostas:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json("Respostas salvas com sucesso.");
  });
};


const normalizeTag = (tag) => {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const checkAnswers = (req, res) => {
  const listaId = req.query.listaId;
  const alunoId = req.query.alunoId;
  let score = 0;

  const query = `
        SELECT r.pergunta_id, r.resposta, p.tag_1, p.tag_2, p.tag_3, p.resposta_correta AS resposta_correta
        FROM respostas r
        JOIN perguntas p ON r.pergunta_id = p.id
        WHERE r.lista_id = ? AND r.aluno_id = ?;
    `;

  db.query(query, [listaId, alunoId], (err, data) => {
    if (err) return res.json(err);

    const resultados = data.map((item) => ({
      perguntaId: item.pergunta_id,
      respostaAluno: item.resposta,
      respostaCorreta: item.resposta_correta,
      correta: item.resposta === item.resposta_correta,
      tag1: item.tag_1,
      tag2: item.tag_2,
      tag3: item.tag_3,
    }));

    const totalTagCounts = {};
    const wrongTagCounts = {};
    const correctTagCounts = {};

    const tagMap = new Map();

    resultados.forEach((item) => {
      const tags = [item.tag1, item.tag2, item.tag3].filter(Boolean);
      tags.forEach((tag) => {
        const normalizedTag = normalizeTag(tag);
        if (!tagMap.has(normalizedTag)) {
          tagMap.set(normalizedTag, tag);
        }
        totalTagCounts[normalizedTag] =
          (totalTagCounts[normalizedTag] || 0) + 1;
      });
      if (item.correta) {
        score++;
      }
    });

    resultados.forEach((item) => {
      const tags = [item.tag1, item.tag2, item.tag3].filter(Boolean);
      tags.forEach((tag) => {
        const normalizedTag = normalizeTag(tag);
        if (!item.correta) {
          wrongTagCounts[normalizedTag] =
            (wrongTagCounts[normalizedTag] || 0) + 1;
        } else {
          correctTagCounts[normalizedTag] =
            (correctTagCounts[normalizedTag] || 0) + 1;
        }
      });
    });

    const tagErrorRates = Object.keys(wrongTagCounts).reduce((acc, tag) => {
      acc[tag] = wrongTagCounts[tag] / totalTagCounts[tag];
      return acc;
    }, {});

    const sortedWrongTags = Object.entries(tagErrorRates)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((entry) => tagMap.get(entry[0])); 
    const sortedCorrectTags = Object.entries(correctTagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((entry) => tagMap.get(entry[0]));

    return res.status(200).json({
      resultados,
      topWrongTags: sortedWrongTags,
      topCorrectTags: sortedCorrectTags,
      score: score,
    });
  });
};



export const saveResultTags = (req, res) => {
  const { alunoId, listaId, tags, tagsCons, turno, score, formato } = req.body;

  const insertQuery = `
    INSERT INTO resultado_listas (aluno_id, lista_id, tags, tagCons, turno, score, formato)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const tagsString = tags.join(",");
  const tagsConsString = tagsCons.join(",");

  db.query(
    insertQuery,
    [alunoId, listaId, tagsString, tagsConsString, turno, score, formato],
    (err, data) => {
      if (err) {
        console.error("Erro ao inserir no resultado_listas:", err);
        return res
          .status(500)
          .json({ message: "Erro ao salvar resultados", error: err });
      }

      return res.status(200).json("Resultados salvos com sucesso.");
    }
  );
};


export const checkIfExists = (req, res) => {
  const listaId = req.query.listaId;

  const query = "SELECT * FROM resultado_listas WHERE lista_id = ?;";
  const queryCount =
    "SELECT COUNT(*) AS total_perguntas FROM lista_perguntas WHERE lista_id = ?;";

  db.query(query, [listaId], (err, results) => {
    if (err) {
      console.error("Erro ao verificar existência:", err);
      return res.status(500).json(err);
    }

    db.query(queryCount, [listaId], (errCount, countResults) => {
      if (errCount) {
        console.error("Erro ao contar perguntas:", errCount);
        return res.status(500).json(errCount);
      }

      return res.status(200).json({
        results,
        total_perguntas: countResults[0].total_perguntas,
      });
    });
  });
};


export const checkIfExistsAluno = (req, res) => {
  const listaId = req.query.listaId;
  const alunoId = req.query.alunoId;

  const query = "SELECT * FROM resultado_listas WHERE lista_id = ? AND aluno_id = ?;";
   const queryCount =
     "SELECT COUNT(*) AS total_perguntas FROM lista_perguntas WHERE lista_id = ?;";

  

  db.query(query, [listaId, alunoId], (err, results) => {
    if (err) {
      console.error("Erro ao verificar existência:", err);
      return res.status(500).json(err);
    }

    db.query(queryCount, [listaId], (errCount, countResults) => {
      if (errCount) {
        console.error("Erro ao contar perguntas:", errCount);
        return res.status(500).json(errCount);
      }

      return res.status(200).json({
        results,
        total_perguntas: countResults[0].total_perguntas,
      });
    });
  });
};
