import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #000000;
  color: white;
`;

const LoginCard = styled.div`
  background: white;
  color: #000000;
  padding: 3rem;
  border-radius: 12px;
  border: 2px solid #000000;
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

const Title = styled.h1`
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #555555;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const LoginButton = styled.button`
  background: #000000;
  color: white;
  border: 2px solid #000000;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #000000;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome to FeedBox</Title>
        <Subtitle>Sign in to access your personalized feed</Subtitle>
        <LoginButton onClick={login}>
          <GoogleIcon />
          Sign in with Google
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
