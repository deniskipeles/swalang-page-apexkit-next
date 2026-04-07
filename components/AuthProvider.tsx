// components/AuthProvider.tsx
'use client';

import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { apex } from '@/lib/apexkit';
import { logoutAction } from '@/app/actions';
import type { User } from '@apexkit/sdk';

// 1. Define the shape of our Auth State
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | undefined;
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  token: undefined,
});

export function AuthProvider({
  token,
  children
}: {
  token: string | undefined;
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync token to the SDK instance immediately during hydration
  if (token) {
    apex.setToken(token);
  }

  const checkAuth = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      // Ensure the main proxy client has the token before fetching
      apex.setToken(token);
      
      const userProfile = await apex.auth.getMe();
      
      if (userProfile?.id) {
        setUser(userProfile);
      } else {
        throw new Error("Invalid user");
      }
    } catch (e) {
      console.error("Auth validation failed", e);
      setUser(null);
      apex.setToken("");
      // Only logout if there was a token but it's now invalid
      if (token) await logoutAction();
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Export the custom hook
export const useApexAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useApexAuth must be used within an AuthProvider');
  }
  return context;
};