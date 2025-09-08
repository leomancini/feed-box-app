import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import LoginPage from "../pages/LoginPage";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #cccccc;
  border-top: 4px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #666666;
  font-size: 1rem;
`;

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#000000" }}>Access Denied</h2>
          <p style={{ color: "#666666" }}>
            You need admin privileges to access this page.
          </p>
        </div>
      </LoadingContainer>
    );
  }

  return children;
};

export default ProtectedRoute;
