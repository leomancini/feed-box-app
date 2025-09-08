import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DeviceEdit from "./pages/DeviceEdit";
import { AuthSuccess, AuthFailure } from "./routes/AuthCallback";
import DebugInfo from "./components/DebugInfo";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth/failure" element={<AuthFailure />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/device/edit/:serialNumber"
            element={
              <ProtectedRoute>
                <DeviceEdit />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <DebugInfo />
      </Router>
    </AuthProvider>
  );
}

export default App;
