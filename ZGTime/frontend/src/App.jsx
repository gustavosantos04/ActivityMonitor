// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { GlobalStyles } from "./GlobalStyles";
import axios from "axios";

import Dashboard from "./pages/Dashboard";
import ActivitiesLog from "./pages/ActivitiesLog";
import Analytics from "./pages/Analytics";
import ManualEntry from "./pages/ManualEntry";
import ManualEntriesList from "./pages/ManualEntriesList";
import Login from "./pages/Login/Login";

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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

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

  // após const tabs = [...]
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // recarrega completamente e redireciona
  };

  const handleViewUserLog = (username) => {
    setSelectedUser(username);
    setPage("log");
  };

  const handleTabClick = (id) => {
    setPage(id);
    if (id === "log") setSelectedUser(null);
  };

  const Layout = () => (
    <>
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
        <NavButton onClick={handleLogout} style={{ marginLeft: "auto" }}>
          Sair
        </NavButton>
      </NavBar>

      {page === "dashboard" && <Dashboard onViewUserLog={handleViewUserLog} />}
      {page === "log" && <ActivitiesLog filterUser={selectedUser} />}
      {page === "analytics" && <Analytics />}
      {page === "manual" && <ManualEntry />}
      {page === "manual-list" && <ManualEntriesList />}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
