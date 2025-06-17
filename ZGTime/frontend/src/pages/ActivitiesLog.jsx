import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: nowrap; /* impede quebra de linha */
  overflow-x: auto; /* permite scroll horizontal caso não caiba */
`;

const FilterInput = styled.input`
  padding: 0.5rem 1.5rem 0.5rem 2.5rem;
  font-size: 1rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  width: 220px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  background-repeat: no-repeat;
  background-position: 8px center;
  background-size: 16px 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  /* Ícone de usuário no input de texto */
  ${({ type }) =>
    type === "text" &&
    `
    background-image: url("data:image/svg+xml;utf8,<svg fill='${encodeURIComponent(
      "#ccc"
    )}' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>");
  `}

  /* Ícone de calendário no input date */
  ${({ type }) =>
    type === "date" &&
    `
    background-image: url("data:image/svg+xml;utf8,<svg fill='${encodeURIComponent(
      "#999"
    )}' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5z'/></svg>");
  `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  width: 180px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  }
`;

const ClearButton = styled.button`
  flex-shrink: 0; /* não deixa o botão encolher */
  padding: 0.55rem 1.2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: 0 5px 12px ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Mantém os outros styled components iguais (Tabela, Thead, Th, Tr, Td, etc)
// ... (Use o mesmo que você já tem)

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  overflow: hidden;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.header};
`;

const Th = styled.th`
  padding: 1rem;
  text-align: ${({ center }) => (center ? "center" : "left")};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onHeader};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tr = styled.tr`
  background-color: ${({ index, theme }) =>
    index % 2 === 0 ? theme.colors.surface : theme.colors.altSurface};
  transition: background-color 0.25s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const Td = styled.td`
  padding: 0.875rem 1rem;
  text-align: ${({ center }) => (center ? "center" : "left")};
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyRow = styled.tr`
  td {
    padding: 2rem;
    text-align: center;
    font-style: italic;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Pagination = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingText = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.colors.muted};
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  font-weight: bold;
`;

function parseDateLocal(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function ActivitiesLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 20;

  // Estados dos filtros
  const [filterUser, setFilterUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/activities/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => setActivities(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filterUser, filterStatus, filterDateStart, filterDateEnd]);

  const uniqueStatuses = useMemo(() => {
    const statusesSet = new Set(activities.map((a) => a.status));
    return Array.from(statusesSet).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const usernameMatch =
        filterUser.trim() === "" ||
        act.username.toLowerCase().includes(filterUser.toLowerCase());

      const statusMatch = filterStatus === "" || act.status === filterStatus;

      const timestamp = new Date(act.timestamp);

      let dateStartMatch = true;
      if (filterDateStart) {
        const startDate = parseDateLocal(filterDateStart);
        startDate.setHours(0, 0, 0, 0);
        dateStartMatch = timestamp >= startDate;
      }

      let dateEndMatch = true;
      if (filterDateEnd) {
        const endDate = parseDateLocal(filterDateEnd);
        endDate.setHours(23, 59, 59, 999);
        dateEndMatch = timestamp <= endDate;
      }

      return usernameMatch && statusMatch && dateStartMatch && dateEndMatch;
    });
  }, [activities, filterUser, filterStatus, filterDateStart, filterDateEnd]);

  const totalPages = Math.ceil(filteredActivities.length / perPage);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * perPage,
    page * perPage
  );

  function clearFilters() {
    setFilterUser("");
    setFilterStatus("");
    setFilterDateStart("");
    setFilterDateEnd("");
  }

  return (
    <Container>
      <Title>Histórico de Atividades</Title>

      <FilterContainer>
        <FilterInput
          type="text"
          placeholder="Filtrar por usuário"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          aria-label="Filtro por usuário"
        />

        <FilterSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filtro por status"
        >
          <option value="">Todos os status</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </FilterSelect>

        <FilterInput
          type="date"
          value={filterDateStart}
          onChange={(e) => setFilterDateStart(e.target.value)}
          aria-label="Data inicial"
          placeholder="Data inicial"
        />

        <FilterInput
          type="date"
          value={filterDateEnd}
          onChange={(e) => setFilterDateEnd(e.target.value)}
          aria-label="Data final"
          placeholder="Data final"
        />

        <ClearButton
          onClick={clearFilters}
          disabled={
            !filterUser.trim() &&
            !filterStatus &&
            !filterDateStart &&
            !filterDateEnd
          }
          aria-label="Limpar todos os filtros"
        >
          Limpar Filtros
        </ClearButton>
      </FilterContainer>

      {loading && <LoadingText>Carregando...</LoadingText>}
      {error && <ErrorText>Erro: {error}</ErrorText>}

      {!loading && !error && (
        <>
          <Table>
            <Thead>
              <tr>
                <Th>Usuário</Th>
                <Th>Título da Janela</Th>
                <Th center>Status</Th>
                <Th center>Data/Hora</Th>
              </tr>
            </Thead>
            <tbody>
              {paginatedActivities.length === 0 ? (
                <EmptyRow>
                  <td colSpan="4">Nenhuma atividade registrada.</td>
                </EmptyRow>
              ) : (
                paginatedActivities.map((act, idx) => (
                  <Tr key={idx} index={idx}>
                    <Td>{act.username}</Td>
                    <Td>{act.window_title || "Sem título"}</Td>
                    <Td center>{act.status}</Td>
                    <Td center>{new Date(act.timestamp).toLocaleString()}</Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>

          <Pagination>
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <PageInfo>
              {page} / {totalPages}
            </PageInfo>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </Pagination>
        </>
      )}
    </Container>
  );
}

export default ActivitiesLog;
