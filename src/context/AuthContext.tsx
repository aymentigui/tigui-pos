// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  role: string;
  perms: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Vérifier si nous avons des tokens en localStorage
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");

        if (storedRefresh) {
          // Si nous avons un refresh token, essayons de rafraîchir
          if (storedAccess) {
            // Vérifier si le token est encore valide
            const isExpired = isTokenExpired(storedAccess);
            if (!isExpired) {
              // Token encore valide, on peut l'utiliser
              const userData = JSON.parse(localStorage.getItem("user") || "null");
              setUser(userData);
              setAccessToken(storedAccess);
              setIsLoading(false);
              return;
            }
          }

          // Si le token est expiré ou inexistant, on rafraîchit
          await refreshToken();
        }
      } catch (error) {
        console.error("Erreur d'initialisation de l'authentification:", error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await window.electron.auth.login(username, password);
      if (response.ok) {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        setUser(response.user);
        setAccessToken(response.access);
        navigate("/");
      } else {
        throw new Error(response.error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await window.electron.auth.logout(refreshToken);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setAccessToken(null);
      setIsLoading(false);
      navigate("/login");
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await window.electron.auth.refresh(refreshToken);
      if (response.ok) {
        localStorage.setItem("accessToken", response.access);
        localStorage.setItem("refreshToken", response.refresh);
        
        // Récupérer les nouvelles permissions si nécessaire
        const userData = JSON.parse(localStorage.getItem("user") || "null");
        if (userData) {
          setUser(userData);
        }
        setAccessToken(response.access);
        return response.access;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};