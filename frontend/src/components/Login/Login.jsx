import React, { useState } from "react";
import {
  LoginContainer,
  LoginForm,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  LoginItems,
} from "./Login.style";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
        import.meta.env.VITE_API_URL + "/login",
        formData
      );
      console.log("Login realizado com sucesso:", response.data);

      if (response.data.user.userType == "aluno") {
        console.log(response.data.user);
        navigate("/aluno/turma", { state: { user: response.data.user } });
      } else if (response.data.user.userType == "professor") {
        navigate("/professor", { state: { user: response.data.user } });
      }

      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erro ao realizar login. Por favor, tente novamente.");
      }
    }
  };

  return (
    <LoginContainer>
      <LoginItems>
        <h1>Login</h1>
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="text"
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

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <SubmitButton type="submit">Entrar</SubmitButton>
        </LoginForm>
      </LoginItems>
    </LoginContainer>
  );
}

export default Login;
