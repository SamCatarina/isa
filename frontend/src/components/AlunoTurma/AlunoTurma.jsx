import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar/SideBar";
import Resultado from "../Resultado/Resultado";
import Header from "../Header/Header";
import Lista from "../Lista/Lista";
import AlunoTurmaInscrito from "../AlunoTurmaInscrito/AlunoTurmaInscrito";
import { Contents } from "./AlunoTurma.style";
import { Main } from "../Turma/Turma.style";

function AlunoTurma() {
  const location = useLocation();
  const user = location.state?.user;
  const [flagTurma, setFlagTurma] = useState(false);
  const [flagLista, setFlagLista] = useState(false);
  const [flagResposta, setFlagResposta] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState([]);
  const [selectedLista, setSelectedLista] = useState([]);
  const [selectedResposta, setSelectecResposta] = useState([]);

  const handleSetFlagTurma = (flag, turma) => {
    setFlagTurma(flag);
    setSelectedTurma(turma);
    setFlagLista(false);
    setFlagResposta(false);
  };

  const handleSetFlagLista = async (flag, lista, aluno) => {
    setSelectedLista(lista);
    setFlagTurma(false);

    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/aluno/turma/resultado/verificarAluno",
        {
          params: {
            listaId: lista.id,
            alunoId: aluno.id,
          },
        }
      );

      if (response.data.results.length !== 0) {
        return handleSetFlagResposta(true);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }

    setFlagLista(flag);
    setFlagResposta(false);
  };

  const handleSetFlagResposta = (flag, resposta) => {
    setFlagResposta(flag);
    setFlagLista(false);
    setFlagTurma(false);
    setSelectecResposta(resposta);
  };

  const renderContent = () => {
    if (flagTurma) {
      console.log("TELA DA TURMA", selectedTurma);
      return (
        <AlunoTurmaInscrito
          user={user}
          turma={selectedTurma}
          handleSetFlagLista={handleSetFlagLista}
          handleSetFlagResposta={handleSetFlagResposta}
        />
      );
    }
    if (flagLista) {
      return (
        <Lista
          lista={selectedLista}
          aluno={user}
          turma={selectedTurma}
          handleSetFlagResposta={handleSetFlagResposta}
        />
      );
    }
    if (flagResposta) {
      return (
        <Resultado
          lista={selectedLista}
          aluno={user}
          turma={selectedTurma}
          handleSetFlagTurma={handleSetFlagTurma}
        />
      );
    }
  };

  return (
    <>
      <Main>
        <SideBar
          userName={user.userName}
          userType={user.userType}
          userId={user?.id}
          handleSetFlagTurma={handleSetFlagTurma}
          bgcolor={user.bgcolor}
        />
        <Contents>
          <Header turma={selectedTurma} />
          {renderContent()}
        </Contents>
      </Main>
    </>
  );
}

export default AlunoTurma;
