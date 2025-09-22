'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserAccount } from '@/lib/types/user';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        const userData = { ...data, customId: data.id };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        console.error('Auth init error:', err);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading || !user) return;

    if (user.role === 'ADMIN' || user.role === 'OWNER' || user.role === 'MANAJER') {
      router.push('/dashboard');
    } else if (user.role === 'TEKNISI') {
      router.push('/absen');
    } else {
      router.push('/');
    }
  }, [user, router, isLoading]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Login gagal');
      if (!result.success || !result.data) throw new Error('Response login tidak valid');

      const userData = { ...result.data, customId: result.data.id };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.role === 'ADMIN' || userData.role === 'OWNER' || userData.role === 'MANAJER') {
        router.replace('/dashboard');
      } else if (userData.role === 'TEKNISI') {
        router.replace('/absen');
      } else {
        router.replace('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) console.log('[Auth] Logout API success');
    } catch (err) {
      console.error('[Auth] Logout fetch error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      router.replace('/');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
