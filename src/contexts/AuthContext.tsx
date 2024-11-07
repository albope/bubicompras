import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthError
} from 'firebase/auth';
import { auth, sendVerificationEmail } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada';
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo electrónico';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Por favor, verifica tu correo y contraseña';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Por favor, inténtalo más tarde';
    case 'auth/network-request-failed':
      return 'Error de conexión. Por favor, verifica tu conexión a internet';
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil';
    case 'auth/operation-not-allowed':
      return 'La operación no está permitida';
    case 'auth/popup-closed-by-user':
      return 'La ventana de autenticación fue cerrada';
    default:
      console.error('Auth error:', error);
      return 'Error al procesar la solicitud. Por favor, inténtalo de nuevo';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Por favor, completa todos los campos');
      }

      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      if (!result.user.emailVerified) {
        await logout();
        toast.error(
          'Por favor verifica tu correo electrónico antes de iniciar sesión',
          {
            duration: 6000,
            id: 'verify-email'
          }
        );
        const resend = window.confirm('¿Deseas recibir un nuevo correo de verificación?');
        if (resend) {
          await sendVerificationEmail();
          toast.success('Se ha enviado un nuevo correo de verificación', {
            duration: 4000
          });
        }
        throw new Error('email-not-verified');
      }
      
      toast.success('¡Inicio de sesión exitoso!');
    } catch (error) {
      if ((error as AuthError).code) {
        throw new Error(getAuthErrorMessage(error as AuthError));
      } else if (error instanceof Error) {
        if (error.message === 'email-not-verified') {
          throw new Error('Verifica tu correo electrónico y vuelve a intentar iniciar sesión');
        }
        throw error;
      }
      throw new Error('Error al iniciar sesión');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Por favor, completa todos los campos');
      }

      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await sendVerificationEmail();
      await logout(); // Log out after registration to force email verification
      toast.success(
        'Cuenta creada correctamente. Por favor, revisa tu correo electrónico para verificar tu cuenta.',
        { duration: 6000 }
      );
      return result;
    } catch (error) {
      if ((error as AuthError).code) {
        throw new Error(getAuthErrorMessage(error as AuthError));
      }
      throw new Error('Error al crear la cuenta');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada correctamente', {
        id: 'logout-success' // Add a unique ID to prevent duplicates
      });
    } catch (error) {
      if ((error as AuthError).code) {
        throw new Error(getAuthErrorMessage(error as AuthError));
      }
      throw new Error('Error al cerrar sesión');
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const sent = await sendVerificationEmail();
      if (sent) {
        toast.success('Se ha enviado un nuevo correo de verificación');
      }
    } catch (error) {
      if ((error as AuthError).code) {
        throw new Error(getAuthErrorMessage(error as AuthError));
      }
      throw new Error('Error al enviar el correo de verificación');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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