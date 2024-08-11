import { db } from "../db.js";

export const getTags = (req, res) => {
  const turmaId = req.params.turmaId;

  const getCodigo = `
      SELECT codigo FROM turmas
      WHERE id = ?
    `;
  db.query(getCodigo, [turmaId, turmaId, turmaId], (err, cod) => {
    if (err) {
      console.error("Erro ao buscar codigo:", err);
      return res.status(500).json(err);
    }
    const codigo = cod[0].codigo;

    const query = `
      SELECT DISTINCT p.tag_1 AS tag FROM perguntas p
      JOIN lista_perguntas lp ON p.id = lp.pergunta_id
      JOIN listas l ON lp.lista_id = l.id
      JOIN turma_listas tl ON l.id = tl.lista_id
      JOIN turmas t on tl.turma_id = t.id
	    WHERE t.codigo = ?
      UNION
      SELECT DISTINCT p.tag_2 AS tag FROM perguntas p
      JOIN lista_perguntas lp ON p.id = lp.pergunta_id
      JOIN listas l ON lp.lista_id = l.id
      JOIN turma_listas tl ON l.id = tl.lista_id
      JOIN turmas t on tl.turma_id = t.id
	    WHERE t.codigo = ?
      UNION
      SELECT DISTINCT p.tag_3 AS tag FROM perguntas p
      JOIN lista_perguntas lp ON p.id = lp.pergunta_id
      JOIN listas l ON lp.lista_id = l.id
      JOIN turma_listas tl ON l.id = tl.lista_id
      JOIN turmas t on tl.turma_id = t.id
	    WHERE t.codigo = ?
    `;

    db.query(query, [codigo, codigo, codigo], (err, data) => {
      if (err) {
        console.error("Erro ao buscar tags:", err);
        return res.status(500).json(err);
      }

      const uniqueTags = data.map(row => row.tag).filter(Boolean);
      return res.status(200).json(uniqueTags);
    });
  });
};