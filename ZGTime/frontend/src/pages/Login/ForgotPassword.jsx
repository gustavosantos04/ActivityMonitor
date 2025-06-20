import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Wrapper = styled.div`
  display: flex;
  width: 900px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  background: #fff;
`;

const LeftPanel = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #1c1c1c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const Logo = styled.img`
  width: 240px;
  height: auto;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
`;

const Label = styled.label`
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #1c1c1c;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: box-shadow: 0px 5px 10px #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/forgot-password/", { email });
      setMessage("Enviamos instruções para o seu e-mail. Verifique sua caixa de entrada.");
    } catch (err) {
      setMessage("Não foi possível enviar as instruções. Verifique o e-mail.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <LeftPanel>
          <Title>Esqueceu sua Senha?</Title>
          <form onSubmit={handleSubmit}>
            <Label>Digite seu e-mail:</Label>
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Enviar Instruções</Button>
          </form>
          {message && <Message>{message}</Message>}
        </LeftPanel>

        <RightPanel>
          <Logo src="/ZGlogo.png" alt="Zavagna Gralha Advogados" />
        </RightPanel>
      </Wrapper>
    </Container>
  );
}
