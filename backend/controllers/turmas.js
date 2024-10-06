import { db } from "../db.js";

export const listarTurmas = (req, res) => {
  const userId = req.query.userId;
  const userType = req.query.userType;

  let query;
  if (userType === "aluno") {
    query =
      "SELECT t.* FROM turmas t INNER JOIN turma_alunos ta ON t.id = ta.turma_id WHERE ta.aluno_id = ?";
  } else if (userType === "professor") {
    query = "SELECT * FROM turmas WHERE professor_id = ?";
  } else {
    return res.status(400).json({ message: "Tipo de usuário inválido" });
  }

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao consultar turmas:", err);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }

    res.status(200).json({ turmas: results });
  });
};