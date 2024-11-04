/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Main,
  MainContent,
  Alunos,
  Titulo,
  Listas,
  Materiais,
  MainItems,
  Image,
  ButtonNew,
  StyledImage,
} from "./Turma.style";
import Carousel from "../Carousel/Carousel";
import Modal from "../Modal/Modal";
import listLogo from "../../assets/listLogo.png";
import refLogo from "../../assets/refLogo.png";

function Turma({
  user,
  turma,
  handleSetFlagNovaLista,
  handleSetFlagLista,
  handleSetFlagNovaRef,
  render,
}) {
  const [alunos, setAlunos] = useState([]);
  const [listas, setListas] = useState([]);
  const [refs, setRefs] = useState([]);
  const turmaId = turma.id;
  const [selectedRef, setSelectedRef] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alunosResponse = await axios.get(
          import.meta.env.VITE_API_URL + "/ListarAlunos",
          {
            params: {
              turmaId: turmaId,
            },
          }
        );
        setAlunos(alunosResponse.data.alunos);

        const listasResponse = await axios.get(
          import.meta.env.VITE_API_URL + "/listas",
          {
            params: {
              turmaId: turmaId,
            },
          }
        );
        setListas(listasResponse.data.listas.reverse());

        const refsResponse = await axios.get(
          import.meta.env.VITE_API_URL + "/aluno/turma/turmaRef",
          {
            params: {
              turmaId: turmaId,
            },
          }
        );
        setRefs(refsResponse.data.reverse());
      } catch (error) {
        console.error("Erro ao buscar dados da turma:", error);
      }
    };

    if (turma.id) {
      fetchData();
    }
  }, [turma, render]);

  const openModal = (refData) => {
    setSelectedRef(refData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRef(null);
  };

  return (
    <Main>
      <MainContent>
        <MainItems>
          <Alunos>
            <Titulo>
              <p>Alunos</p>
            </Titulo>
            <Carousel
              items={alunos}
              renderItem={(aluno) => (
                <div className="dataCaros">
                  <StyledImage style={{ border: "1px solid #533ad4" }}>
                    {aluno.nome[0]}
                  </StyledImage>
                  <p style={{ color: "#494949" }}>{aluno.nome}</p>
                </div>
              )}
            />
          </Alunos>

          <Listas>
            <Titulo>
              <div>
                <p>Listas</p>
              </div>
              <ButtonNew
                onClick={() => handleSetFlagNovaLista(true)}
                className="new"
              >
                Nova lista
              </ButtonNew>
            </Titulo>
            <Carousel
              items={listas}
              renderItem={(lista) => (
                <div
                  onClick={() => handleSetFlagLista(true, lista)}
                  className="dataCaros"
                >
                  <StyledImage>
                    <div className="listLogo">
                      <img src={listLogo} alt="listLogo" />
                    </div>
                  </StyledImage>

                  <p style={{ color: "#494949" }}>{lista.nome}</p>
                </div>
              )}
            />
          </Listas>

          <Materiais>
            <Titulo>
              <div>
                <p>Referencias</p>
              </div>
              <ButtonNew
                onClick={() => handleSetFlagNovaRef(true)}
                className="new"
              >
                Nova Referência
              </ButtonNew>
            </Titulo>
            <Carousel
              items={refs}
              renderItem={(ref) => (
                <div onClick={() => openModal(ref)} className="dataCaros">
                  <StyledImage>
                    <div className="listLogo refLogo">
                      <img src={refLogo} alt="refLogo" />
                    </div>
                  </StyledImage>
                  <p style={{ color: "#494949" }}>{ref.tag}</p>
                  <p style={{ color: "#5c5c5cc3", "font-size": "12px" }}>
                    {ref.formato}
                  </p>
                </div>
              )}
            />
          </Materiais>
        </MainItems>
      </MainContent>
      <Modal isOpen={isModalOpen} onClose={closeModal} refData={selectedRef} />
    </Main>
  );
}

export default Turma;
