// /app/(auth)/Login.tsx

import { useState, useEffect } from "react";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register"; // Garante que o novo componente seja importado
import ForgotPassword from "@/components/auth/ForgotPassword";
import { useAuth } from "@/context/AuthProvider";

export default function AuthScreen() {
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const { signIn } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');

        if (accessToken && refreshToken && expiresIn) {
          signIn({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: parseInt(expiresIn),
            user: null, // O usuário será buscado no provedor de autenticação
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, [signIn]);

  // Renderiza o componente com base no estado
  switch (authView) {
    case 'register':
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    case 'forgotPassword':
      return <ForgotPassword onSwitchToLogin={() => setAuthView('login')} />;
    case 'login':
    default:
      return (
        <Login
          onSwitchToRegister={() => setAuthView('register')}
          onSwitchToForgotPassword={() => setAuthView('forgotPassword')}
        />
      );
  }
}
