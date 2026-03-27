"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type AppAbility,
  createAbilityFor,
  createGuestAbility,
  type User,
} from "@/lib/casl/ability";
import { getUser } from "@/utils/auth-storage";

type AbilityContextType = {
  ability: AppAbility;
  user: User | null;
  updateAbility: (user: User) => void;
  resetAbility: () => void;
};

const AbilityContext = createContext<AbilityContextType | undefined>(undefined);

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const [ability, setAbility] = useState<AppAbility>(createGuestAbility());
  const [user, setUser] = useState<User | null>(null);

  const updateAbility = useCallback((newUser: User) => {
    setUser(newUser);
    setAbility(createAbilityFor(newUser));
  }, []);

  const resetAbility = useCallback(() => {
    setUser(null);
    setAbility(createGuestAbility());
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const userData = getUser();
        const userWithRole: User = {
          id: userData?.adminId || "1",
          name: userData?.name || "User",
          email: userData?.email || "user@example.com",
          role: {
            id: userData?.adminId || "1",
            name: userData?.name || "user",
            permissions: userData?.permissions || [],
          },
        };
        updateAbility(userWithRole);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [updateAbility]);

  return (
    <AbilityContext.Provider
      value={{ ability, user, updateAbility, resetAbility }}
    >
      {children}
    </AbilityContext.Provider>
  );
}

export function useAbility() {
  const context = useContext(AbilityContext);
  if (context === undefined) {
    throw new Error("useAbility must be used within an AbilityProvider");
  }
  return context;
}
