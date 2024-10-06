import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form } from "../NewList/NewList.style";
import { Main, MainContent, MainItems } from "../Turma/Turma.style";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import arrow from "../../assets/arrow.png";

const QuestionFormRef = ({ turmaId }) => {
  const [references, setReferences] = useState([]);
  const [tags, setTags] = useState([]);
  const [newReference, setNewReference] = useState({
    turmaId: turmaId,
    ref: "",
    tag: "",
    formato: "Vídeo",
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/tags`, {
          params: {
            turmaId: turmaId,
          },
        });
        setTags(response.data);
        console.log("refs: ", response.data)
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
      }
    };

    fetchTags();
  }, [turmaId]);

  const handleAddReference = async () => {
    try {
      setReferences([...references, newReference]);

      const response = await axios.post(
        "http://localhost:8800/professor/adicionarRef",
        newReference
      );
      console.log("Data saved to database:", response.data);
      setNewReference({
        turmaId: turmaId,
        ref: "",
        tag: "",
        formato: "Vídeo",
      });
      toast.success("Referência adicionada!");
    } catch (error) {
      console.error("Error saving data to database:", error);
    }
  };

  const handleChangeReference = (e, key) => {
    setNewReference({
      ...newReference,
      [key]: e.target.value,
    });
  };

  return (
    <div className="questionForm">
      <p className="textTitle">
        Adicione aqui referências de estudos para a turma.
      </p>
      <ToastContainer />
      <div className="resref">
        <div className="ref refItem">
          <label>Referência: </label>
          <input
            type="text"
            value={newReference.ref}
            onChange={(e) => handleChangeReference(e, "ref")}
          />
        </div>
        <div className="refTag refItem">
          <label>Assunto:</label>
          <div>
            <input
              list="tag-options"
              type="text"
              value={newReference.tag}
              onChange={(e) => handleChangeReference(e, "tag")}
              placeholder="Selecione ou adicione uma tag"
            />
            <datalist id="tag-options">
              {tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <div className="resposta">
          <label>Formato:</label>
          <select
            value={newReference.formato}
            onChange={(e) => handleChangeReference(e, "formato")}
          >
            <option value="Vídeo">Vídeo</option>
            <option value="Livro">Livro</option>
            <option value="Artigo">Artigo</option>
            <option value="Podcast">Podcast</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
      </div>
      <button onClick={handleAddReference} className="addPergunta addRef">
        Adicionar Referência
      </button>
    </div>
  );
};

function NewRef({ turma, handleSetFlagTurma }) {
  const turmaId = turma.id;
  return (
    <Main>
      <MainContent>
        <img
          src={arrow}
          alt="voltar"
          onClick={() => handleSetFlagTurma(true, turma)}
          className="seta"
        />
        <MainItems>
          <Form>
            <QuestionFormRef turmaId={turmaId} />
          </Form>
        </MainItems>
      </MainContent>
    </Main>
  );
}

export default NewRef;
