import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
`;

const Username = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
`;

const Label = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.accent};
`;

const Info = styled.p`
  margin: 0.25rem 0;
`;

// Adicione no topo
const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.button || "#000"};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.buttonHover || "#333"};
  }
`;

export default function Dashboard({ onViewUserLog }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/activities/summary?date=" + new Date().toISOString().slice(0, 10))
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erro ao carregar dados", err));
  }, []);

  return (
    <Container>
      <Title>Equipe TI</Title>
      <Grid>
        {users.map((user) => (
          <UserCard key={user.username}>
            <Username>{user.username}</Username>
            <Info><Label>Primeira atividade:</Label> {new Date(user.first_seen).toLocaleTimeString()}</Info>
            <Info><Label>Última atividade:</Label> {new Date(user.last_seen).toLocaleTimeString()}</Info>
            <Info><Label>Tempo ativo:</Label> {(user.active_seconds / 60).toFixed(1)} min</Info>
            <Info><Label>Atividade:</Label> {user.active_percent}%</Info>
            <Button onClick={() => onViewUserLog(user.username)}>
              Ver histórico
            </Button>
          </UserCard>
        ))}
      </Grid>
    </Container>
  );
}
