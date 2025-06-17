import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { GlobalStyles } from "./GlobalStyles";

import Dashboard from "./pages/Dashboard";
import ActivitiesLog from "./pages/ActivitiesLog";
import Analytics from "./pages/Analytics";
import ManualEntry from "./pages/ManualEntry";
import ManualEntriesList from "./pages/ManualEntriesList";

const AppContainer = styled.div`
  min-height: 100vh;
  max-width: 1120px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.pagePadding};
`;

const NavBar = styled.nav`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.navPadding};
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.navShadow};
`;

const NavButton = styled.button`
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: none;
  cursor: pointer;
  color: ${({ active, theme }) => (active ? theme.colors.buttonText : theme.colors.text)};
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
  box-shadow: ${({ active, theme }) => (active ? theme.shadows.buttonShadow : "none")};
  transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primaryHover : "#f0f0f0"};
  }
`;

function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);

  const tabs = [
    { id: "dashboard", label: "Resumo" },
    { id: "log", label: "Histórico Atividades" },
    { id: "analytics", label: "Análise" },
    { id: "manual", label: "Cadastrar Horas Manuais" },
    { id: "manual-list", label: "Listar Horas Manuais" },
  ];

  // Função para navegar para aba de histórico com filtro de usuário
  const handleViewUserLog = (username) => {
    setSelectedUser(username);
    setPage("log");
  };

  // Função para navegar entre abas, limpa filtro se for aba "log"
  const handleTabClick = (id) => {
    setPage(id);
    if (id === "log") setSelectedUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppContainer>
        <NavBar>
          {tabs.map(({ id, label }) => (
            <NavButton
              key={id}
              active={page === id}
              onClick={() => handleTabClick(id)}
              aria-current={page === id ? "page" : undefined}
            >
              {label}
            </NavButton>
          ))}
        </NavBar>

        {page === "dashboard" && <Dashboard onViewUserLog={handleViewUserLog} />}
        {page === "log" && <ActivitiesLog filterUser={selectedUser} />}
        {page === "analytics" && <Analytics />}
        {page === "manual" && <ManualEntry />}
        {page === "manual-list" && <ManualEntriesList />}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
