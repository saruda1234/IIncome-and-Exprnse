import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, logoutUser, testConnection } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemoUser: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Test initial Firestore connectivity
    testConnection();

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          setIsDemoUser(false);
        }
        setLoading(false);
      },
      (authError) => {
        console.error('Auth state error:', authError);
        setError(authError.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('หน้าต่างเข้าสู่ระบบถูกปิดก่อนเสร็จสิ้น');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError(null);
      } else {
        setError(err.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsDemoUser(false);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  const enableDemoMode = () => {
    setIsDemoUser(true);
  };

  const disableDemoMode = () => {
    setIsDemoUser(false);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoUser,
        loginWithGoogle,
        logout,
        enableDemoMode,
        disableDemoMode,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
