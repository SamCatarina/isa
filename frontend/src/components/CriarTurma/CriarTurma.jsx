import React, { useState } from "react";
import axios from "axios";

function CriarTurma({ user }) {
  const [turmaName, setTurmaName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTurmaNameChange = (e) => {
    setTurmaName(e.target.value);
  };

  const handleCriarTurmaSubmit = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/criar-turma", {
        professorId: user.id,
        turmaName,
      });
      setTurmaName("");
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      setErrorMessage("Erro ao criar turma.");
    }
  };

  return (
    <div>
      <h2>Criar Turma</h2>
      <input
        type="text"
        value={turmaName}
        onChange={handleTurmaNameChange}
        placeholder="Nome da Turma"
      />
      <button onClick={handleCriarTurmaSubmit}>Criar</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default CriarTurma;
