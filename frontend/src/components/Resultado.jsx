import React, { useState, useEffect } from "react";
import { Main, MainContent, Header, Title, MainItems } from "./Turma.style";
import { ListaNome, Question } from "./Lista.style";
import { Score, Result, ResultContent, Subtitulo } from "./Resultado.style";
import axios from "axios";

function Resultado({ lista, aluno }) {
  const [resultados, setResultados] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const alunoId = aluno.id;
  const listaId = lista.id;
  const [materiais, setMateriais] = useState([]);
  const formato = aluno.formato;

  let score = 0;

  useEffect(() => {
    // Fetch results
    axios
      .get(
        `http://localhost:8800/aluno/turma/${alunoId}/lista/${listaId}/resultado`
      )
      .then((response) => {
        setResultados(response.data.resultados);
        setTopTags(response.data.topWrongTags);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [alunoId, listaId]);

  resultados.forEach((resultado) => {
    if (resultado.correta) {
      score++;
    }
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8800/aluno/turma/listaRef/${listaId}`)
      .then((response) => {
        setMateriais(response.data);
      })
      .catch((error) => console.log(error));
  }, [listaId]);

  let allFormats = [];
  let oneFormat = [];

  materiais.forEach((material) => {
    const tagsDisc = material.tag;
    const tagsFormt = material.formato;
    let matchDisc = "";
    let matchFormt = "";

    if (topTags.includes(tagsDisc)) {
      matchDisc = tagsDisc;
    }
    if (tagsFormt.includes(formato)) {
      matchFormt = tagsFormt;
    }

    if (matchDisc) {
      if (matchFormt) {
        oneFormat.push(material.ref);
      } else {
        allFormats.push(material.ref);
      }
    }
  });

  allFormats.sort(() => Math.random() - 0.5);
  const materiaisRelevantes = oneFormat.concat(allFormats).slice(0, 30);

  return (
    <Main>
      <MainContent>
        <MainItems>
          <ListaNome>{lista.nome}</ListaNome>
          <Subtitulo>
            <p className="subtitulo">Veja aqui os resultados</p>
          </Subtitulo>
          <Result>
            <ResultContent>
              <p>Média de acertos: </p>
              <div>
                <h4>{score}</h4>
              </div>
            </ResultContent>
            <ResultContent>
              <p>Assuntos recomendados para estudo</p>
              <div>
                <ul>
                  {topTags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            </ResultContent>
            <ResultContent>
              <p>Materiais Recomendados</p>
              <div>
                <ul>
                  {materiaisRelevantes.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </div>
            </ResultContent>
          </Result>
        </MainItems>
      </MainContent>
    </Main>
  );
}

export default Resultado;
