import express from "express";
import { saveRef, getReferences } from "../controllers/refs.js";
import { checkAnswers, saveAnswers, saveResultTags, checkIfExists, checkIfExistsAluno } from '../controllers/responses.js';
import { addQuestion, getQuestions } from "../controllers/questions.js";
import { cadastro, inserirAluno, inserirProfessor } from '../controllers/cadastro.js';
import { checkLogin } from "../controllers/login.js";
import { participarTurma } from "../controllers/participateTurma.js";
import { criarTurma } from "../controllers/createTurma.js";
import { getChamada, getGrupos, salvarChamada, salvarGrupos } from "../controllers/grupos.js";
import { getTags } from "../controllers/tags.js";
import { getListas } from "../controllers/listas.js";
import { ListarAlunos } from "../controllers/listarAlunos.js";
import { listarTurmas } from "../controllers/turmas.js";


const router = express.Router();

router.post("/professor/turma/novalista", addQuestion);
router.post("/professor/salvarGrupos", salvarGrupos);
router.get("/grupos/getGrupos", getGrupos);
router.post("/professor/salvarGrupos/api", salvarChamada)
router.get("/grupos/chamada", getChamada)
router.post("/professor/adicionarRef", saveRef);
router.get("/aluno/turma/lista", getQuestions);
router.get("/aluno/turma/turmaRef", getReferences);
router.post("/aluno/turma/resultado", saveAnswers);
router.get("/aluno/turma/resultado/verificar", checkIfExists);
router.get("/aluno/turma/resultado/verificarAluno", checkIfExistsAluno);
router.get("/aluno/turma/lista/resultado", checkAnswers);
router.post('/aluno/turma/lista/salvarTags', saveResultTags);
router.post("/login", checkLogin);
router.post('/cadastro', cadastro);

router.post('/participar-turma', participarTurma);

router.get('/turmas', listarTurmas);

router.get('/listas', getListas);

router.get('/ListarAlunos', ListarAlunos);

router.post('/turmas/criar-turma', criarTurma);

router.get('/tags', getTags);



export default router;