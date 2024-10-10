import React, { useState, useEffect } from "react";
import {
  Main,
  MainContent,
  Header,
  Title,
  MainItems,
} from "../Turma/Turma.style";
import { ListaNome, Question } from "../Lista/Lista.style";
import {
  Score,
  Result,
  ResultContent,
  Subtitulo,
  Grupos,
} from "./Resultado.style";
import axios from "axios";
import arrow from "../../assets/arrow.png";

function Resultado({ lista, aluno, handleSetFlagTurma, turma }) {
  const [resultados, setResultados] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const alunoId = aluno.id;
  const listaId = lista.id;
  const turmaId = lista.turma_id;
  const [materiais, setMateriais] = useState([]);
  const [formato, setFormato] = useState();
  const [grupos, setGrupos] = useState([]);
  const [chamada, setChamada] = useState(false);
  const [matRelev, setMatRelev] = useState([]);
  const [qntPer, setQntPer] = useState(0);

  const [score, setScore] = useState(0);
  const [alunosMap, setAlunosMap] = useState({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/grupos/chamada", {
        params: {
          turmaId,
          listaId,
        },
      })
      .then((response) => {
        console.log("CHAMADA: ", response.data.exists);
        setChamada(response.data.exists);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [turmaId, listaId]);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/ListarAlunos",
          {
            params: {
              turmaId: turmaId,
            },
          }
        );
        const alunosData = response.data["alunos"];
        console.log(alunosData["alunos"]);
        const alunosMapping = alunosData.reduce((acc, aluno) => {
          acc[aluno.id] = aluno.nome;
          console.log(aluno.nome);
          return acc;
        }, {});
        setAlunosMap(alunosMapping);
      } catch (error) {
        console.error("Erro ao buscar dados dos alunos:", error);
      }
    };

    fetchAlunos();
  }, []);

  useEffect(() => {
    if (chamada) {
      axios
        .get(import.meta.env.VITE_API_URL + "/grupos/getGrupos", {
          params: {
            turmaId,
            listaId,
          },
        })
        .then((response) => {
          console.log("grupos:", response.data);
          const data = response.data;
          const groupedData = data.reduce((acc, item) => {
            const { grupo_id, aluno_id } = item;
            if (!acc[grupo_id]) {
              acc[grupo_id] = [];
            }
            acc[grupo_id].push(aluno_id);
            return acc;
          }, {});

          const gruposArray = Object.keys(groupedData).map((grupo_id) => ({
            grupo_id,
            alunos: groupedData[grupo_id],
          }));

          setGrupos(gruposArray);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [chamada]);

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_API_URL + "/aluno/turma/resultado/verificarAluno",
        {
          params: {
            listaId: lista.id,
            alunoId: aluno.id,
          },
        }
      )
      .then((response) => {
        setQntPer(response.data.total_perguntas);
        console.log("aluno", response.data);
        setScore(response.data.results[0]["score"]);
        setFormato(response.data.results[0]["formato"]);
        const tagsString = response.data.results[0]["tags"];

        const tagsArray = tagsString.split(",").map((tag) => tag.trim());
        console.log(tagsArray);

        setTopTags(tagsArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [lista.id, aluno.id]);

  useEffect(() => {
    if (topTags.length === 0 || !formato) return;

    axios
      .get(import.meta.env.VITE_API_URL + "/aluno/turma/turmaRef", {
        params: {
          turmaId: turmaId,
        },
      })
      .then((response) => {
        console.log("resssss", response.data);
        setMateriais(response.data);

        let allFormats = [];
        let oneFormat = [];

        response.data.forEach((material) => {
          const tagsDisc = material.tag;
          const tagsFormt = material.formato;

          console.log("Processing Material:", material, topTags);

          if (topTags.includes(tagsDisc)) {
            if (tagsFormt === formato) {
              oneFormat.push(material.ref);
              console.log("Added to oneFormat:", material.ref);
            } else {
              allFormats.push(material.ref);
              console.log("Added to allFormats:", material.ref);
            }
          }
        });

        console.log("All Formats:", allFormats);
        console.log("One Format:", oneFormat);

        allFormats.sort(() => Math.random() - 0.5);
        const materiaisRelevantes = oneFormat.concat(allFormats).slice(0, 30);
        setMatRelev(materiaisRelevantes);

        console.log("Materiais Relevantes:", materiaisRelevantes);
      })
      .catch((error) => console.log(error));
  }, [topTags, formato, listaId]);

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
          <ListaNome>{lista.nome}</ListaNome>
          <Subtitulo>
            <p className="subtitulo">Veja aqui os resultados</p>
          </Subtitulo>
          <Result>
            <ResultContent>
              <p>Média de acertos: </p>
              <div>
                <p>
                  {score}/{qntPer}
                </p>
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
                  {matRelev.map((ref, index) => (
                    <li key={index}>{ref}</li>
                  ))}
                </ul>
              </div>
            </ResultContent>
          </Result>
          <Grupos>
            {chamada ? (
              grupos.length > 0 ? (
                grupos.map((grupo) => (
                  <div key={grupo.grupo_id}>
                    <h4>Grupo {grupo.grupo_id}</h4>
                    <ul>
                      {grupo.alunos.length > 0 ? (
                        grupo.alunos.map((aluno_id, index) => (
                          <li key={index}>
                            {alunosMap[aluno_id] || `Aluno ID: ${aluno_id}`}
                          </li>
                        ))
                      ) : (
                        <li>Nenhum aluno disponível.</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <div>Não há grupos para mostrar.</div>
              )
            ) : (
              <div>Não há grupos para mostrar.</div>
            )}
          </Grupos>
        </MainItems>
      </MainContent>
    </Main>
  );
}

export default Resultado;
