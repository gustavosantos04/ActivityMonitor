// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { GlobalStyles } from "./GlobalStyles";
import {
  FaChartPie,
  FaClock,
  FaClipboardList,
  FaSignOutAlt,
  FaPlusCircle,
} from "react-icons/fa";

import Dashboard from "./pages/Dashboard";
import ActivitiesLog from "./pages/ActivitiesLog";
import Analytics from "./pages/Analytics";
import ManualEntry from "./pages/ManualEntry";
import ManualEntriesList from "./pages/ManualEntriesList";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
// import ResetPassword from "./pages/Login/ResetPassword"; // descomente se já existir

const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  width: 240px;
  background-color: #1c1c1c;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  gap: 1rem;
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ active }) => (active ? "#333" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#ccc")};
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #333;
    color: #fff;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
`;

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleViewUserLog = (username) => {
    setSelectedUser(username);
    setPage("log");
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Sidebar>
                    <SidebarButton
                      active={page === "dashboard"}
                      onClick={() => setPage("dashboard")}
                    >
                      <FaChartPie />
                      Resumo
                    </SidebarButton>
                    <SidebarButton
                      active={page === "log"}
                      onClick={() => {
                        setPage("log");
                        setSelectedUser(null);
                      }}
                    >
                      <FaClock />
                      Histórico
                    </SidebarButton>
                    <SidebarButton
                      active={page === "analytics"}
                      onClick={() => setPage("analytics")}
                    >
                      <FaClipboardList />
                      Análise
                    </SidebarButton>
                    <SidebarButton
                      active={page === "manual"}
                      onClick={() => setPage("manual")}
                    >
                      <FaPlusCircle />
                      Cadastrar Horas
                    </SidebarButton>
                    <SidebarButton
                      active={page === "manual-list"}
                      onClick={() => setPage("manual-list")}
                    >
                      <FaClipboardList />
                      Listar Horas
                    </SidebarButton>
                    <SidebarButton onClick={handleLogout} style={{ marginTop: "auto" }}>
                      <FaSignOutAlt />
                      Sair
                    </SidebarButton>
                  </Sidebar>
                  <ContentArea>
                    {page === "dashboard" && <Dashboard onViewUserLog={handleViewUserLog} />}
                    {page === "log" && <ActivitiesLog filterUser={selectedUser} />}
                    {page === "analytics" && <Analytics />}
                    {page === "manual" && <ManualEntry />}
                    {page === "manual-list" && <ManualEntriesList />}
                  </ContentArea>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
