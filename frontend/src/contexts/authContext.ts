import { createContext } from "react";

// 定义用户接口
export interface User {
  id: string;
  username: string;
  balance: number;
  computePoints: number;
  web3Address?: string;
  avatar?: string;
}

// 定义认证上下文接口
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setIsAuthenticated: () => {},
  setUser: () => {},
  login: async () => false,
  logout: () => {},
});