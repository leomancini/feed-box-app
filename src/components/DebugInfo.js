import React from "react";
import styled from "styled-components";

const DebugContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  max-width: 300px;
  z-index: 9999;
`;

const DebugInfo = () => {
  // Only show in development or when explicitly enabled
  const showDebug = process.env.NODE_ENV === "development" || 
                   process.env.REACT_APP_SHOW_DEBUG === "true";

  if (!showDebug) return null;

  return (
    <DebugContainer>
      <div><strong>Environment Debug Info:</strong></div>
      <div>NODE_ENV: {process.env.NODE_ENV || "undefined"}</div>
      <div>REACT_APP_NODE_ENV: {process.env.REACT_APP_NODE_ENV || "undefined"}</div>
      <div>REACT_APP_API_BASE_URL: {process.env.REACT_APP_API_BASE_URL || "undefined"}</div>
      <div>Current URL: {window.location.href}</div>
    </DebugContainer>
  );
};

export default DebugInfo;
