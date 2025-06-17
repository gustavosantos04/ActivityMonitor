import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 72rem;
  margin: 1.5rem auto;
  padding: 1rem 1.5rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  border-radius: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #111;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #333;
  font-size: 0.9rem;
`;

const Thead = styled.thead`
  background-color: #111;
  color: #eee;
`;

const Th = styled.th`
  padding: 8px 12px;
  border: 1px solid #333;
  text-align: left;
  white-space: nowrap;
`;

const Tr = styled.tr`
  background-color: ${({ index }) => (index % 2 === 0 ? "#fafafa" : "#fff")};

  &:hover {
    background-color: #e6e6e6;
  }
`;

const Td = styled.td`
  padding: 8px 12px;
  border: 1px solid #333;
  white-space: nowrap;
`;

const LoadingText = styled.p`
  text-align: center;
  margin-top: 2rem;
  font-weight: 600;
`;

export default function ManualEntriesList() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("http://localhost:8000/manual-entries/");
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error("Erro ao buscar entradas manuais:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  if (loading) return <LoadingText>Carregando entradas manuais...</LoadingText>;

  if (entries.length === 0)
    return <LoadingText>Nenhuma entrada manual cadastrada ainda.</LoadingText>;

  return (
    <Container>
      <Title>Entradas Manuais Cadastradas</Title>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th>Usuário</Th>
              <Th>Data</Th>
              <Th>Início</Th>
              <Th>Fim</Th>
              <Th>Descrição</Th>
            </tr>
          </Thead>
          <tbody>
            {entries.map((entry, idx) => (
              <Tr key={entry.id} index={idx}>
                <Td>{entry.username}</Td>
                <Td>{entry.date}</Td>
                <Td>{entry.start_time}</Td>
                <Td>{entry.end_time}</Td>
                <Td>{entry.description}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
}
