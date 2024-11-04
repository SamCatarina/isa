import { db } from "../db.js";

export const getListas = (req, res) => {
  const turmaId = req.query.turmaId;
  const query =
    "SELECT * FROM listas as  l join turma_listas as tl on l.id = tl.lista_id WHERE turma_id = ?";

  db.query(query, [turmaId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }

    res.status(200).json({ listas: results });
  });
};
