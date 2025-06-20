import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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
  background-color: #1c1c1c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  color: #fff;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const SuccessText = styled.p`
  color: green;
  font-size: 0.95rem;
  text-align: center;
  margin-top: 1rem;
`;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/reset-password/", {
        token,
        new_password: newPassword,
      });
      setSuccessMessage("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Erro ao redefinir a senha. O token pode estar inválido ou expirado.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <LeftPanel>
          <Logo src="/ZGlogo.png" alt="Zavagna Gralha Advogados" />
        </LeftPanel>
        <RightPanel>
          <Title>Redefinir Senha</Title>
          {error && <ErrorText>{error}</ErrorText>}
          <form onSubmit={handleReset}>
            <Input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit">Redefinir Senha</Button>
          </form>
          {successMessage && <SuccessText>{successMessage}</SuccessText>}
        </RightPanel>
      </Wrapper>
    </Container>
  );
};

export default ResetPassword;
