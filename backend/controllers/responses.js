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


export const checkAnswers = (req, res) => {
  const { listaId } = req.params;
  const { alunoId } = req.params;
  var score = 0;

  const query = `
    SELECT r.pergunta_id, r.resposta, p.tag_1, p.tag_2, p.tag_3, p.resposta_correta AS resposta_correta
    FROM respostas r
    JOIN perguntas p ON r.pergunta_id = p.id
    WHERE r.lista_id = ? AND r.aluno_id = ?;
  `;

  db.query(query, [listaId, alunoId], (err, data) => {
    if (err) return res.json(err);

    const normalizeTag = (tag) => {
      return tag
        ? tag
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        : null;
    };

    const originalTagMap = {};

    const resultados = data.map((item) => {
  
      const tag1 = item.tag_1 ? normalizeTag(item.tag_1) : null;
      const tag2 = item.tag_2 ? normalizeTag(item.tag_2) : null;
      const tag3 = item.tag_3 ? normalizeTag(item.tag_3) : null;

      if (tag1) originalTagMap[tag1] = item.tag_1;
      if (tag2) originalTagMap[tag2] = item.tag_2;
      if (tag3) originalTagMap[tag3] = item.tag_3;

      return {
        perguntaId: item.pergunta_id,
        respostaAluno: item.resposta,
        respostaCorreta: item.resposta_correta,
        correta: item.resposta === item.resposta_correta,
        tag1: tag1,
        tag2: tag2,
        tag3: tag3,
      };
    });

    const totalTagCounts = {};
    const wrongTagCounts = {};
    const correctTagCounts = {};

    resultados.forEach((item) => {
      const normalizedTags = [item.tag1, item.tag2, item.tag3].filter(Boolean);
      normalizedTags.forEach((tag) => {
        totalTagCounts[tag] = (totalTagCounts[tag] || 0) + 1;
      });
      if (item.correta) {
        score++;
      }
    });

    resultados.forEach((item) => {
      const normalizedTags = [item.tag1, item.tag2, item.tag3].filter(Boolean);
      normalizedTags.forEach((tag) => {
        if (!item.correta) {
          wrongTagCounts[tag] = (wrongTagCounts[tag] || 0) + 1;
        } else {
          correctTagCounts[tag] = (correctTagCounts[tag] || 0) + 1;
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
      .map((entry) => originalTagMap[entry[0]]); 

    const sortedCorrectTags = Object.entries(correctTagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map((entry) => originalTagMap[entry[0]]); 

  
    const resultadosOriginais = resultados.map((item) => ({
      ...item,
      tag1: originalTagMap[item.tag1],
      tag2: originalTagMap[item.tag2],
      tag3: originalTagMap[item.tag3],
    }));

    return res.status(200).json({
      resultados: resultadosOriginais,
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
  const queryCount = "SELECT COUNT(*) AS total_perguntas FROM lista_perguntas WHERE lista_id = ?;";
  const list = "SELECT  COUNT(*) AS lista_respondida FROM resultado_listas WHERE lista_id = ? AND aluno_id = ?;"


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
      db.query(list, [listaId, alunoId], (errList, countList) => { 
        if (errList) {
          console.error("Erro ao verificar se o aluno respondeu:", errList);
          return res.status(500).json(rrList);
        }
        return res.status(200).json({
          results,
          total_perguntas: countResults[0].total_perguntas,
          lista_respondida: countList[0].lista_respondida,
        });
      });
    });
  });
};
