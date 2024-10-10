import React, { useEffect, useState } from "react";
import {
  CadastroContainer,
  CadastroForm,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  CadastroItems,
} from "./Cadastro.style";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const [userAluno, setUserAluno] = useState(false);
  const [buttonControl, setButtonControl] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    userType: "aluno",
    userFormatPref: "Vídeo",
    userTurno: "Manhã",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUserAluno(formData.userType === "aluno");
  }, [formData.userType]);

  useEffect(() => {
    const checkButtonControl = () => {
      const { username, password, email, userType, userFormatPref, userTurno } =
        formData;
      if (username && password && email && userType) {
        if (userType === "aluno") {
          setButtonControl(userFormatPref && userTurno);
        } else {
          setButtonControl(true);
        }
      } else {
        setButtonControl(false);
      }
    };

    checkButtonControl();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/cadastro",
        formData
      );
      console.log("Cadastro realizado com sucesso:", response.data);
      setShowSuccessModal(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      setErrorMessage(
        "Erro ao realizar cadastro: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <CadastroContainer>
      <CadastroItems>
        <h1>Cadastro</h1>
        <CadastroForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome:</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Senha:</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Tipo do usuário:</Label>
            <select
              name="userType"
              onChange={handleChange}
              value={formData.userType}
            >
              <option value="professor">Professor</option>
              <option value="aluno">Aluno</option>
            </select>
          </FormGroup>
          {userAluno && (
            <>
              <FormGroup>
                <Label>Preferência de formato de materiais:</Label>
                <select
                  name="userFormatPref"
                  onChange={handleChange}
                  value={formData.userFormatPref}
                >
                  <option value="Vídeo">Vídeo</option>
                  <option value="Livro">Livro</option>
                  <option value="Artigo">Artigo</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Podcast">Podcast</option>
                </select>
              </FormGroup>
              <FormGroup>
                <Label>Turno disponível:</Label>
                <select
                  name="userTurno"
                  onChange={handleChange}
                  value={formData.userTurno}
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </FormGroup>
            </>
          )}
          <SubmitButton type="submit" disabled={!buttonControl}>
            Cadastrar
          </SubmitButton>
        </CadastroForm>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </CadastroItems>

      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Cadastro realizado com sucesso!</h2>
            <button onClick={handleModalClose}>Ir para Login</button>
          </div>
          <style jsx>{`
            .modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 0, 0, 0.5);
            }
            .modal-content {
              background: white;
              padding: 20px;
              border-radius: 5px;
              text-align: center;
            }
            button {
              margin-top: 20px;
              padding: 10px 20px;
              border: none;
              background-color: #007bff;
              color: white;
              cursor: pointer;
              border-radius: 5px;
            }
            .error-message {
              margin-top: 20px;
              color: red;
              font-weight: bold;
            }
          `}</style>
        </div>
      )}
    </CadastroContainer>
  );
}

export default Cadastro;
