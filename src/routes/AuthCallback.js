import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CallbackContainer = styled.div`
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

const Message = styled.p`
  margin-top: 1rem;
  color: #666666;
  font-size: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #000000;
  background: #f5f5f5;
  border: 2px solid #000000;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
`;

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Check for token in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          // Store token securely
          localStorage.setItem("auth_token", token);

          // Clean URL by removing token parameter
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } else {
        }

        // Wait a moment for token to be processed
        await new Promise((resolve) => setTimeout(resolve, 500));

        await checkAuthStatus();

        navigate("/dashboard", { replace: true });
      } catch (error) {
        // Clear any potentially invalid token
        localStorage.removeItem("auth_token");
        navigate("/login", { replace: true });
      }
    };

    handleSuccess();
  }, [navigate, checkAuthStatus]);

  return (
    <CallbackContainer>
      <LoadingSpinner />
      <Message>Authentication successful! Redirecting...</Message>
    </CallbackContainer>
  );
};

const AuthFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auto-redirect to login after showing error briefly
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const getErrorMessage = () => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    switch (error) {
      case "access_denied":
        return "Authentication was cancelled. Please try again.";
      case "invalid_request":
        return "Invalid authentication request. Please try again.";
      default:
        return "Authentication failed. Please try again.";
    }
  };

  return (
    <CallbackContainer>
      <ErrorMessage>
        <h3>Authentication Failed</h3>
        <p>{getErrorMessage()}</p>
        <p>Redirecting to login page...</p>
      </ErrorMessage>
    </CallbackContainer>
  );
};

export { AuthSuccess, AuthFailure };
