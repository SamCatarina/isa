import React from "react";

import { Main, MainContent, MainItems } from "../Turma/Turma.style";
import { Form, Question } from "./NewList.style";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ModalContent,
  ModalOverlay,
  CloseButton,
  CancelButton,
  ConfirmButton,
  ButtonContainer,
} from "../Modal/Modal.style";

const QuestionForm = ({
  turmaId,
  handleSetFlagTurma,
  turma,
  setRender,
  render,
}) => {
  const [list, setList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const [tags, setTags] = useState([]);
  const [newList, setNewList] = useState({
    nome: "",
  });
  const [newQuestion, setNewQuestion] = useState({
    pergunta: "",
    alternativa: { a: "", b: "", c: "", d: "" },
    resposta: "a",
    tags: ["", "", ""],
  });

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/tags`, {
            params: {
              turmaId: turmaId,
            }
          }
        );
        setTags(response.data);
        console.log("refs: ", response.data);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
      }
    };

    fetchTags();
  }, [turmaId]);

  const isQuestionValid = (question) => {
    const { pergunta, alternativa, resposta, tags } = question;

    if (!pergunta.trim()) return false;
    for (const key in alternativa) {
      if (!alternativa[key].trim()) return false;
    }
    if (!["a", "b", "c", "d"].includes(resposta)) return false;
    if (!tags.some((tag) => tag.trim() !== "")) return false;

    return true;
  };

  const ifListValid = (list) => {
    if (!list.nome.trim()) return false;
    if (questions.length === 0) return false;
    return questions.every(isQuestionValid);
  };

  const handleAddQuestion = () => {
    if (isQuestionValid(newQuestion)) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({
        pergunta: "",
        alternativa: { a: "", b: "", c: "", d: "" },
        resposta: "a",
        tags: ["", "", ""],
      });
      toast.success("Pergunta adicionada com sucesso!");
      setDisableButton(false);
    } else {
      toast.error(
        "Por favor, preencha todos os campos antes de adicionar a pergunta."
      );
    }
  };

  const handleSaveToJson = async () => {
    if (!ifListValid(newList)) {
      toast.error(
        "A lista ou perguntas são inválidas. Verifique todos os campos."
      );
      return;
    }

    try {
      const response = axios.post(
        "http://localhost:8800/professor/turma/novalista",
        { newList, questions, turmaId }
      );
      console.log("Data saved to database:", response.data);

      setList([]);
      setQuestions([]);
      setNewList({ nome: "" });
      setNewQuestion({
        pergunta: "",
        alternativa: { a: "", b: "", c: "", d: "" },
        resposta: "a",
        tags: ["", "", ""],
      });

      handleSetFlagTurma(true, turma);
      return setRender(!render);
    } catch (error) {
      console.error("Error saving data to database:", error);
      toast.error("Erro ao salvar a lista.");
    }
  };

  const handleChangeAlternative = (e, key) => {
    setNewQuestion({
      ...newQuestion,
      alternativa: { ...newQuestion.alternativa, [key]: e.target.value },
    });
  };

  const handleChangeTag = (e, index) => {
    const newTags = [...newQuestion.tags];
    newTags[index] = e.target.value;
    setNewQuestion({
      ...newQuestion,
      tags: newTags,
    });
  };

  const handleConfirmarFinalizacao = () => {
    handleSaveToJson();
    setShowModal(false);
    handleSetFlagTurma(true, turma);
  };

  const handleCancelamento = () => {
    setShowModal(false);
  };

  return (
    <div className="questionForm">
      <ToastContainer />
      <p className="textTitle">
        Adicione uma nova lista para a turma. Comece adicionando algumas
        questões!
      </p>
      <input
        type="text"
        placeholder="Nome da Lista"
        className="lista_titulo"
        value={newList.nome}
        onChange={(e) => setNewList({ nome: e.target.value })}
      />
      <p className="enunciado">Enunciado</p>
      <textarea
        type="text"
        placeholder="Digite a pergunta"
        value={newQuestion.pergunta}
        onChange={(e) =>
          setNewQuestion({ ...newQuestion, pergunta: e.target.value })
        }
        className="pergunta"
      />

      <div className="alternativas">
        <div>
          <label>a)</label>
          <input
            type="text"
            value={newQuestion.alternativa.a}
            onChange={(e) => handleChangeAlternative(e, "a")}
          />
        </div>
        <div>
          <label>b)</label>
          <input
            type="text"
            value={newQuestion.alternativa.b}
            onChange={(e) => handleChangeAlternative(e, "b")}
          />
        </div>
        <div>
          <label>c)</label>
          <input
            type="text"
            value={newQuestion.alternativa.c}
            onChange={(e) => handleChangeAlternative(e, "c")}
          />
        </div>
        <div>
          <label>d)</label>
          <input
            type="text"
            value={newQuestion.alternativa.d}
            onChange={(e) => handleChangeAlternative(e, "d")}
          />
        </div>
      </div>
      <div className="resposta">
        <label>Alternativa correta:</label>
        <select
          value={newQuestion.resposta}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, resposta: e.target.value })
          }
        >
          <option value="a">a</option>
          <option value="b">b</option>
          <option value="c">c</option>
          <option value="d">d</option>
        </select>
      </div>

      <div className="tags">
        <p>Assuntos:</p>
        <div>
          <input
            list="tag-options"
            type="text"
            value={newQuestion.tags[0]}
            onChange={(e) => handleChangeTag(e, 0)}
          />
        </div>
        <div>
          <input
            list="tag-options"
            type="text"
            value={newQuestion.tags[1]}
            onChange={(e) => handleChangeTag(e, 1)}
          />
          <datalist id="tag-options">
            {tags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </datalist>
        </div>
        <div>
          <input
            list="tag-options"
            type="text"
            value={newQuestion.tags[2]}
            onChange={(e) => handleChangeTag(e, 2)}
          />
        </div>
      </div>

      <button onClick={handleAddQuestion} className="addPergunta">
        Adicionar Pergunta
      </button>
      <p className="nQ">Questões adicionadas: {questions.length}</p>
      <button
        onClick={() => setShowModal(true)}
        className="finalizar"
        disabled={disableButton}
      >
        Finalizar lista
      </button>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCancelamento}>X</CloseButton>
            <h2>Confirmar Finalização</h2>
            <p>Tem certeza que deseja finalizar a lista?</p>
            <ButtonContainer>
              <ConfirmButton onClick={handleConfirmarFinalizacao}>
                Sim
              </ConfirmButton>
              <CancelButton onClick={handleCancelamento}>Cancelar</CancelButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

function NewList({ turma, handleSetFlagTurma }) {
  console.log(turma);

  return (
    <Main>
      <MainContent>
        <MainItems>
          <Form>
            <QuestionForm
              turmaId={turma.id}
              handleSetFlagTurma={handleSetFlagTurma}
              turma={turma}
            />
          </Form>
        </MainItems>
      </MainContent>
    </Main>
  );
}

export default NewList;
