import { db } from "../db.js";

export const getTags = (req, res) => {
  const turmaId = req.query.turmaId;

  const getCodigo = `
      SELECT tag FROM referencias
      WHERE turma_id = ?
    `;
  db.query(getCodigo, [turmaId], (err, data) => {
    if (err) {
      console.error("Erro:", err);
      return res.status(500).json(err);
    }

    const normalizeTag = (tag) => {
      return tag
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    const tagMap = new Map();
    data.forEach((item) => {
      const normalizedTag = normalizeTag(item.tag);
      if (!tagMap.has(normalizedTag)) {
        tagMap.set(normalizedTag, item.tag);
      }
    });
    const uniqueTags = Array.from(tagMap.values());
    return res.status(200).json(uniqueTags);
  });
};
