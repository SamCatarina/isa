import { db } from "../db.js";

export const saveRef = (req, res) => {
  const { turmaId, ref, tag, formato } = req.body;

  if (!turmaId || !ref || !tag || !formato) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  const insertQuery = `
    INSERT INTO referencias (turma_id, ref, tag, formato)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [turmaId, ref, tag, formato], (err, data) => {
    if (err) {
      console.error("Erro ao inserir no banco de dados:", err);
      return res
        .status(500)
        .json({ message: "Erro ao salvar referência", error: err });
    }

    return res
      .status(200)
      .json({ message: "Referência salva com sucesso.", data: data });
  });
};


export const getReferences = (req, res) => {
  const turmaId = req.query.turmaId;

  const q = `
        SELECT id, ref, tag, formato 
        FROM referencias 
        WHERE turma_id = ?
    `;

  db.query(q, [turmaId], (err, data) => {
    if (err) return res.status(500).json(err);

    const references = data.map((row) => ({
      id: row.id,
      ref: row.ref,
      tag: row.tag,
      formato: row.formato,
    }));

    return res.status(200).json(references);
  });
};
