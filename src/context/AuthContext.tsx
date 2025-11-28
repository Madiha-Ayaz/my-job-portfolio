'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    // You can add any side effects here, like analytics or logging,
    // when the auth state changes.
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
