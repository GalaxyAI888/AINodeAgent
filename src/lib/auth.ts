import type { User } from "@/api/auth/model/user.type";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";

/**
 * 获取存储的 token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 设置 token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 清除 token
 */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * 检查是否有有效的 token
 */
export function hasValidToken(): boolean {
  const token = getToken();
  return token !== null && token.length > 0;
}

/**
 * 获取用户信息
 */
export function getUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 设置用户信息
 */
export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // if (user.access_token) {
  //   setToken(user.access_token ?? "1234567890");
  // }
  /**
   * TODO: 测试环境使用
   * 设置 token 为 1234567890
   * 用于测试
   *  */
  setToken("1234567890");
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  clearToken();
}

/**
 * 检查用户是否已登录
 */
export function isAuthenticated(): boolean {
  return hasValidToken() && getUser() !== null;
}
