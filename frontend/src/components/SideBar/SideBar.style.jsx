import styled from "styled-components";

export const Side = styled.div`
  font-size: 16px;
  height: 100%;
  width: 15vw;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: white;
  color: #494949;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  scrollbar-width: thin;
  scrollbar-color: #dbdbdb transparent;
  justify-content: center;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 4px;
  }
`;

export const SideBarItems = styled.div`
  width: 60%;
  height: 75%;
  display: flex;
  align-items: center;
  flex-direction: column;

  .sair {
    font-size: 14px;
    margin-top: 40px;
    color: #f53939;
    cursor: pointer;
    margin-bottom: 50px;
    &:hover {
      border: 1px solid #f53939;
      border-left: none;
      border-right: none;
      border-top: none;
    }
  }
`;

export const UserItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h4 {
    margin-top: 30px;
  }
  img {
    height: 100px;
  }
  p {
    color: #494949c8;
    font-size: 12px;
    margin-top: 5px;
  }
`;

export const TurmasItems = styled.div`
  display: flex;
  align-items: right;
  justify-content: center;
  flex-direction: column;
  margin-top: 50px;
  width: 100%;

  p {
    margin-bottom: 15px;
    color: #494949c8;
    font-size: 14px;
  }
`;

export const TurmaButton = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 15px;

  &:hover {
    cursor: pointer;
  }
`;

export const TurmasList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20px;
`;

export const NewTurmaButton = styled.div`
  text-align: center;
  margin-top: 50px;
  padding: 10px;
  width: 100%;
  border: 1px solid #bdbdbd;
  border-radius: 15px;

  &:hover {
    background-color: #e3e3e3;
    cursor: pointer;
  }
`;

export const Modal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalContent = styled.div`
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
  width: 40%;
`;

export const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
`;
