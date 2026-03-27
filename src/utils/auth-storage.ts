"use client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import type { TUserData } from "@/contexts/auth-context";
import { decrypt, encrypt } from "./encryption";

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY ?? "accessToken";
const USER_KEY = process.env.NEXT_PUBLIC_USER_KEY ?? "userData";

export const getToken = (): string | null => {
  try {
    let encryptedToken = Cookies.get(TOKEN_KEY) ?? null;

    if (!encryptedToken) {
      encryptedToken = localStorage.getItem(TOKEN_KEY);
    }

    if (encryptedToken) {
      return decrypt(encryptedToken);
    }
    return null;
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    const encryptedToken = encrypt(token);
    localStorage.setItem(TOKEN_KEY, encryptedToken);
    Cookies.set(TOKEN_KEY, encryptedToken);
  } catch {
    // Handle storage error silently
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Handle storage error silently
  }
};

export const getUser = (): TUserData | null => {
  try {
    const encryptedUser = localStorage.getItem(USER_KEY);
    if (encryptedUser) {
      const decryptedUser = decrypt(encryptedUser);
      return JSON.parse(decryptedUser);
    }
    return null;
  } catch {
    return null;
  }
};

export const setUser = (user: TUserData): void => {
  try {
    const encryptedUser = encrypt(JSON.stringify(user));
    localStorage.setItem(USER_KEY, encryptedUser);
  } catch {
    // Handle storage error silently
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // Handle storage error silently
  }
};

export const clearAuthData = (message?: string): void => {
  toast.success(message ?? "Logging Out...");
  removeToken();
  removeUser();
};
