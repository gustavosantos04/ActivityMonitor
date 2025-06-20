import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  position: relative;
  color: #fff;
`;

const Logo = styled.img`
  width: 240px;
  height: auto;
`;

const SystemName = styled.h1`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 700;
  font-size: 2.4rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.accent || "#ccc"};
  font-weight: 500;
  font-style: italic;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
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
  box-shadow: 0px 5px 10px #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ForgotPassword = styled.p`
  text-align: right;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};

  span {
    color: #1c1c1c;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease, text-decoration 0.3s ease;

    &:hover {
      color: #333b;
      text-decoration: none;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username: email,
        password,
      }, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", response.data.access_token);
      navigate("/");
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Container>
      <Wrapper>
        <LeftPanel>
          <Title>Entrar no Sistema</Title>
          {error && <ErrorText>{error}</ErrorText>}
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Entrar</Button>
          </form>
          <ForgotPassword>
            <span onClick={handleForgotPassword}>Esqueci minha senha</span>
          </ForgotPassword>
        </LeftPanel>

        <RightPanel>
          {/* <SystemName>ZGTime</SystemName>
          <Tagline>Monitoramento de Atividades</Tagline> */}
          <Logo src="/ZGlogo.png" alt="Zavagna Gralha Advogados" />
        </RightPanel>
      </Wrapper>
    </Container>
  );
};

export default Login;
