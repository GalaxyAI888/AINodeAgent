import { useEffect, useState } from "react";
import type { User } from "@/api/auth/model/user.type";
import {
  getToken,
  getUser,
  setUser,
  clearAuth,
  isAuthenticated,
} from "@/lib/auth";
import { AuthContext } from "./AuthContext.1";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化时检查认证状态
    const initAuth = () => {
      try {
        const token = getToken();
        const userData = getUser();

        if (token && userData) {
          setUserState(userData);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setUserState(userData);
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticated(),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
