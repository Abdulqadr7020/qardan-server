"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'viewer' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Determine role from user metadata or custom logic
        // For now, we'll keep the role in state, but ideally it should come from Supabase profiles
        const savedRole = localStorage.getItem('userRole') as UserRole;
        setRole(savedRole);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        const savedRole = localStorage.getItem('userRole') as UserRole;
        setRole(savedRole);
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('userRole');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole || '');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  // Protect routes
  useEffect(() => {
    if (!loading && !role && pathname !== '/login' && pathname !== '/') {
      router.push('/login');
    }
  }, [role, pathname, router, loading]);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
