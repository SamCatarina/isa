import { db } from "../db.js";


export const addQuestion = (req, res) => {
  const { newList, questions, turmaId } = req.body;

  if (!Array.isArray(questions)) {
    return res
      .status(400)
      .json({ error: "Os dados devem ser uma série de perguntas" });
  }

  if (!turmaId) {
    return res.status(400).json({ error: "Turma id não esta definido" });
  }
  const listName = newList.nome;
  const insertListQuery = "INSERT INTO listas (nome) VALUES (?)";

  db.query(insertListQuery, [listName], (err, result) => {
    if (err) {
      return res.json(err);
    }

    const listId = result.insertId;

    const insertQuestionsQuery = `
            INSERT INTO perguntas 
            (pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, tag_1, tag_2, tag_3) 
            VALUES ?
        `;

    const questionValues = questions.map((question) => [
      question.pergunta,
      question.alternativa.a,
      question.alternativa.b,
      question.alternativa.c,
      question.alternativa.d,
      question.resposta,
      question.tags[0],
      question.tags[1],
      question.tags[2],
    ]);

    db.query(insertQuestionsQuery, [questionValues], (err, result) => {
      if (err) {
        return res.json(err);
      }

      const insertedQuestionIds = [];
      for (
        let i = result.insertId;
        i < result.insertId + result.affectedRows;
        i++
      ) {
        insertedQuestionIds.push(i);
      }

      const insertAssociationsQuery =
        "INSERT INTO lista_perguntas (lista_id, pergunta_id) VALUES ?";
      const associationValues = insertedQuestionIds.map((questionId) => [
        listId,
        questionId,
      ]);

      db.query(insertAssociationsQuery, [associationValues], (err, result) => {
        if (err) {
          return res.json(err);
        }
        const insertTurmaListaQuery =
          "INSERT INTO turma_listas (turma_id, lista_id) VALUES (?, ?)";
        db.query(insertTurmaListaQuery, [turmaId, listId], (err, result) => {
          if (err) {
            return res.json(err);
          }
        });
      });
    });
  });
};


export const getQuestions = (req, res) => {
  const listaId = req.query.listaId;
  const q = `
        SELECT p.id, p.pergunta, p.alternativa_a, p.alternativa_b, p.alternativa_c, p.alternativa_d 
        FROM perguntas as p
        JOIN lista_perguntas as lp on p.id = lp.pergunta_id
        JOIN listas as l on l.id = lp.lista_id
        WHERE lista_id = ?
    `;

  db.query(q, [listaId], (err, data) => {
    if (err) return res.status(500).json(err);

    const questions = data.map((row) => ({
      id: row.id,
      question: row.pergunta,
      alternatives: {
        a: row.alternativa_a,
        b: row.alternativa_b,
        c: row.alternativa_c,
        d: row.alternativa_d,
      },
    }));

    return res.status(200).json(questions);
  });
};
