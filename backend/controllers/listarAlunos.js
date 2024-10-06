import { db } from "../db.js";

export const ListarAlunos = (req, res) => {
  const turmaId = req.query.turmaId;
  if (!turmaId) {
    console.error("ID da turma não fornecido");
    return res.status(400).json({ message: "ID da turma é obrigatório" });
  }

  const query = `
      SELECT a.* FROM alunos a
      INNER JOIN turma_alunos ta ON a.id = ta.aluno_id
      WHERE ta.turma_id = ?
  `;

  db.query(query, [turmaId], (err, results) => {
    if (err) {
      console.error("Erro ao consultar alunos da turma:", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }

    res.status(200).json({ alunos: results });
  });
};
