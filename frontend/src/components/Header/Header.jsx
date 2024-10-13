import React from "react";
import { Main, Title } from "./Header.style";

function Header(props) {
  var textCod = "";
  if (props.turma.codigo != undefined) {
    textCod = "Código: ";
  }
  var bgcolor = props.turma.bgcolor;

  return (
    <Main style={{ backgroundColor: bgcolor || "#E3E3E3" }}>
      <Title>{props.turma.nome}</Title>
      <p>
        {textCod}
        {props.turma.codigo}
      </p>
    </Main>
  );
}

export default Header;
