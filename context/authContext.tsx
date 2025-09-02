'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserAccount } from '@/lib/types/user';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
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
          logout();
          return;
        }
        const data = await res.json();
        setUser({ ...data, customId: data.id });
      } catch (err) {
        console.error('Auth init error:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);


  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Login gagal');
      }

      if (!result.success || !result.data) {
        throw new Error('Response login tidak valid');
      }

      const userData = { ...result.data, customId: result.data.id };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.role === 'ADMIN' || userData.role === 'OWNER' || userData.role === 'MANAJER') {
        router.replace('/admin/dashboard');
      } else if (userData.role === 'TEKNISI') {
        router.replace('/admin/absen');
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

  // Fungsi logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
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
