import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  margin-bottom: 2rem;
  label {
    font-weight: 500;
    margin-right: 1rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.text};
    border-radius: 5px;
  }
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 0 12px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme }) => theme.border};
  }

  th {
    background: ${({ theme }) => theme.header};
    text-align: left;
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

export default function Analytics() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    axios
      .get(`http://localhost:8000/activities/summary?date=${date}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erro ao buscar dados de análise", err));
  }, [date]);

  return (
    <Container>
      <Title>Resumo de Atividades - {date}</Title>

      <FilterContainer>
        <label>Selecionar data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </FilterContainer>

      <ChartContainer>
        <h3>Tempo Ativo por Usuário (min)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="username" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={(d) => d.active_seconds / 60} name="Minutos Ativos" fill="#333" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <Table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Primeira Atividade</th>
            <th>Última Atividade</th>
            <th>Tempo Ativo (min)</th>
            <th>Total Monitorado (min)</th>
            <th>Atividade (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{new Date(user.first_seen).toLocaleTimeString()}</td>
              <td>{new Date(user.last_seen).toLocaleTimeString()}</td>
              <td>{(user.active_seconds / 60).toFixed(1)}</td>
              <td>{(user.total_seconds / 60).toFixed(1)}</td>
              <td>{user.active_percent}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
