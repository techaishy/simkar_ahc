'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserAccount } from '@/lib/types/user';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
<<<<<<< HEAD
  logout: () => void;
=======
  logout: () => Promise<void>;
>>>>>>> default
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
<<<<<<< HEAD
  logout: () => {},
=======
  logout: async () => {},
>>>>>>> default
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
<<<<<<< HEAD
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
=======
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
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
        }
>>>>>>> default
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

<<<<<<< HEAD

=======
>>>>>>> default
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const result = await res.json();
<<<<<<< HEAD

      if (!res.ok) {
        throw new Error(result.error || 'Login gagal');
      }

      if (!result.success || !result.data) {
        throw new Error('Response login tidak valid');
      }
=======
      if (!res.ok) throw new Error(result.error || 'Login gagal');
      if (!result.success || !result.data) throw new Error('Response login tidak valid');
>>>>>>> default

      const userData = { ...result.data, customId: result.data.id };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userData.role === 'ADMIN' || userData.role === 'OWNER' || userData.role === 'MANAJER') {
<<<<<<< HEAD
        router.replace('/admin/dashboard');
      } else if (userData.role === 'TEKNISI') {
        router.replace('/admin/absen');
      } else {
        router.replace('/');
      }

=======
        router.replace('/dashboard');
      } else if (userData.role === 'TEKNISI') {
        router.replace('/absen');
      } else {
        router.replace('/');
      }
>>>>>>> default
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  // Fungsi logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
=======
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
>>>>>>> default
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
