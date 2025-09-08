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
        console.log("Starting initial auth check with API URL:", API_BASE_URL);

        if (!API_BASE_URL) {
          console.error(
            "API_BASE_URL is not set! Check environment variables."
          );
          setUserWithPersistence(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/status`, {
          credentials: "include"
        });

        console.log(
          "Auth status response:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          console.error(
            "Auth status request failed:",
            response.status,
            response.statusText
          );
          setUserWithPersistence(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Auth status data:", data);

        if (data.authenticated) {
          console.log("User is authenticated:", data.user);
          setUserWithPersistence(data.user);
        } else {
          console.log("Initial auth check: User not authenticated");
          setUserWithPersistence(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        console.error("Error details:", error.message);
        setUserWithPersistence(null);
      } finally {
        setLoading(false);
      }
    };

    initialAuthCheck();
  }, [setUserWithPersistence]); // Include setUserWithPersistence dependency

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: "include"
      });
      const data = await response.json();

      if (data.authenticated) {
        setUserWithPersistence(data.user);
      } else {
        console.log("Auth status check: User not authenticated");
        setUserWithPersistence(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUserWithPersistence(null);
    } finally {
      setLoading(false);
    }
  }, [setUserWithPersistence]);

  const login = () => {
    if (!API_BASE_URL) {
      console.error("Cannot login: API_BASE_URL is not set!");
      alert(
        "Configuration error: API URL not set. Please check environment variables."
      );
      return;
    }

    const loginUrl = `${API_BASE_URL}/auth/google`;
    console.log("Redirecting to login URL:", loginUrl);
    window.location.href = loginUrl;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      setUserWithPersistence(null);
    } catch (error) {
      console.error("Logout failed:", error);
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
      console.error("Profile update failed:", error);
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
      console.error("Failed to get user profile:", error);
      throw error;
    }
  };

  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      try {
        // If url is relative, prepend the API base URL
        const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
          ...options,
          credentials: "include"
        });

        if (response.status === 401) {
          console.warn("401 Unauthorized - attempting to refresh auth status");

          // Try to refresh auth status first
          try {
            const authResponse = await fetch(`${API_BASE_URL}/auth/status`, {
              credentials: "include"
            });
            const authData = await authResponse.json();

            if (authData.authenticated) {
              // User is actually authenticated, update the user state and retry the original request
              setUserWithPersistence(authData.user);
              console.log("Auth status refreshed, retrying request");

              // Retry the original request
              const retryResponse = await fetch(fullUrl, {
                ...options,
                credentials: "include"
              });

              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
          } catch (authError) {
            console.error("Auth status check failed:", authError);
          }

          // If we get here, authentication truly failed
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
        console.error("Request failed:", error);
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
