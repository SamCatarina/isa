import { db } from "../db.js";

const colors = [
  "#a3c2c2",
  "#b2d8b4",
  "#f6b1b1",
  "#e5e0ff",
  "#f7c4a8",
  "#d0d0d0",
  "#f5f5dc",
];

function getRandomColor(colors) {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}


export const cadastro = async (req, res) => {
  const { username, password, email, userType, userFormatPref, userTurno } =
    req.body;

  try {
    if (userType === "aluno") {
      await inserirAluno({
        username,
        password,
        email,
        userFormatPref,
        userTurno,
      });
    } else if (userType === "professor") {
      await inserirProfessor({ username, password, email });
    }

    res.status(200).json({ message: "Cadastro realizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao realizar cadastro:", error.message);
    res.status(400).json({ message: error.message });
  }
};



export async function inserirAluno(dados) {
  var bgcolor = getRandomColor(colors);
  try {
    const emailExists = await checkEmail(dados.email);

    if (emailExists) {
      throw new Error("O email já está em uso.");
    }

    const result = await db.query(
      "INSERT INTO alunos (nome, senha, email, material_formato, turno, bgcolor) VALUES (?, ?, ?, ?, ?, ?)",
      [
        dados.username,
        dados.password,
        dados.email,
        dados.userFormatPref,
        dados.userTurno,
        bgcolor,
      ]
    );
    return result;
  } catch (error) {
    throw error;
  }
}


export async function inserirProfessor(dados) {
  try {
    const emailExists = await checkEmail(dados.email);
    if (emailExists) {
      throw new Error("O email já está em uso.");
    }

    const result = await db.query(
      "INSERT INTO professores (nome, senha, email) VALUES (?, ?, ?)",
      [dados.username, dados.password, dados.email]
    );
    return result;
  } catch (error) {
    throw error;
  }
}

export function checkEmail(email) {
  return new Promise((resolve, reject) => {
    const checkEmailQuery = `
      SELECT COUNT(*) AS rep FROM alunos WHERE email = ? 
      UNION ALL
      SELECT COUNT(*) AS rep FROM professores WHERE email = ?
    `;
    db.query(checkEmailQuery, [email, email], (err, results) => {
      if (err) {
        console.error("Erro ao verificar o email:", err);
        return reject(err);
      }
      
      const emailExists = results.some(result => result.rep > 0);
      resolve(emailExists);
    });
  });
}


