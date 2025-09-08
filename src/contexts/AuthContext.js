import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback
} from "react";

const AuthContext = createContext();

// Get the API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserWithPersistence = useCallback((userData) => {
    setUser(userData);
  }, []);

  useEffect(() => {
    // Inline auth check to avoid dependency issues
    const initialAuthCheck = async () => {
      try {
        if (!API_BASE_URL) {
          setUserWithPersistence(null);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}/auth/status`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          },
          credentials: "include"
        });

        if (!response.ok) {
          setUserWithPersistence(null);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.authenticated) {
          setUserWithPersistence(data.user);
        } else {
          setUserWithPersistence(null);
        }
      } catch (error) {
        setUserWithPersistence(null);
      } finally {
        setLoading(false);
      }
    };

    initialAuthCheck();
  }, [setUserWithPersistence]); // Include setUserWithPersistence dependency

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("auth_token");
        setUserWithPersistence(null);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.authenticated) {
        setUserWithPersistence(data.user);
      } else {
        setUserWithPersistence(null);
      }
    } catch (error) {
      setUserWithPersistence(null);
    } finally {
      setLoading(false);
    }
  }, [setUserWithPersistence]);

  const login = () => {
    if (!API_BASE_URL) {
      alert(
        "Configuration error: API URL not set. Please check environment variables."
      );
      return;
    }

    const loginUrl = `${API_BASE_URL}/auth/google`;
    window.location.href = loginUrl;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });
      }

      // Clear token and user state
      localStorage.removeItem("auth_token");
      setUserWithPersistence(null);
    } catch (error) {
      // Still clear local state even if server request fails
      localStorage.removeItem("auth_token");
      setUserWithPersistence(null);
    }
  };

  const updateProfile = async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const data = await response.json();
        setUserWithPersistence(data.user);
        return data;
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setUserWithPersistence(data.user);
        return data.user;
      }
    } catch (error) {
      throw error;
    }
  };

  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      try {
        const token = localStorage.getItem("auth_token");

        // If url is relative, prepend the API base URL
        const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
          ...options,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
            ...options.headers
          },
          credentials: "include"
        });

        if (response.status === 401) {
          // Clear invalid token and user state
          localStorage.removeItem("auth_token");
          setUserWithPersistence(null);

          // Check if we're in development (React's NODE_ENV or custom REACT_APP_NODE_ENV)
          const isDevelopment =
            process.env.NODE_ENV === "development" ||
            process.env.REACT_APP_NODE_ENV === "development";

          if (isDevelopment) {
            throw new Error(
              "Authentication expired. Please refresh the page and log in again."
            );
          }

          // In production, redirect to login
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Request failed" }));
          throw new Error(error.error || "Request failed");
        }

        return await response.json();
      } catch (error) {
        throw error;
      }
    },
    [setUserWithPersistence]
  ); // Include setUserWithPersistence dependency

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        getUserProfile,
        makeAuthenticatedRequest,
        checkAuthStatus,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
