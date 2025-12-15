import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// AuthProvider component to manage authentication state and provide it to the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const { user, token } = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(user);
        setToken(token);
      } catch {
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem(
      "auth",
      JSON.stringify({ user: userData, token })
    );
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};