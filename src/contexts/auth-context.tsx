"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { authApi } from "@/api/auth/authApi";
import type { PromiseApiResponse } from "@/types/api-response";
import type { Permission, TAdmin, UserRole } from "@/types/auth";
import {
  clearAuthData,
  getToken,
  setToken,
  setUser,
} from "@/utils/auth-storage";

/* ================= TYPES ================= */

export type TUserData = TAdmin & {
  token: string;
};

export type AuthState = {
  user: TUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthContextType = AuthState & {
  login: (credentials: LoginCredentials) => PromiseApiResponse;
  logout: () => void;
  clearError: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  updateUser: (updatedAdmin: TAdmin) => void;
};

/* ================= REDUCER ================= */

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: TUserData | null }
  | { type: "SET_TOKEN"; payload: string | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* Restore session */
  useEffect(() => {
    const init = async () => {
      try {
        const token = getToken();
        if (token) {
          const result = await authApi.validate();

          const admin = result?.data?.admin;

          if (!admin) {
            throw new Error("Invalid admin data");
          }

          const user: TUserData = {
            ...admin,
            token,
          };

          dispatch({ type: "SET_USER", payload: user });
        }
      } catch {
        dispatch({ type: "SET_USER", payload: null });
        clearAuthData("Session expired. Please log in again.");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    init();
  }, []);

  /* LOGIN */
  const login = async (credentials: LoginCredentials): PromiseApiResponse => {
    const result = await authApi.login(credentials);

    const token = result.data.accessToken;
    const admin = result.data.admin;

    if (!(admin && token)) {
      throw new Error("Invalid login response");
    }

    const user: TUserData = {
      ...admin,
      token,
    };

    setToken(token);
    dispatch({ type: "SET_USER", payload: user });

    return {
      success: true,
      message: "Login successful",
      status: 200,
      data: user,
    };
  };

  /* LOGOUT */
  const logout = () => {
    clearAuthData();
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => dispatch({ type: "SET_ERROR", payload: null });

  const hasRole = (roles: UserRole[]) => {
    if (!state.user) {
      return false;
    }
    return roles.includes(state.user.role as UserRole);
  };

  const hasPermission = (_permission: Permission) => {
    // TODO: allow everything
    return true;
  };

  const updateUser = (updatedAdmin: TAdmin) => {
    if (!state.user) {
      return;
    }

    const updatedUser: TUserData = {
      ...state.user,
      ...updatedAdmin,
    };

    setUser(updatedUser);
    dispatch({ type: "SET_USER", payload: updatedUser });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        hasRole,
        hasPermission,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
