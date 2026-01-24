
import { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken } from '@/lib/axios';

const SESSION_KEY = 'my-session';
const SAVED_ACCOUNTS_KEY = 'saved-accounts';

// --- Tipos ---
type User = {
  id: string;
  email: string;
  displayName: string | null;
};

type Session = {
  access_token: string;
  user: User;
};

// Novo tipo para contas salvas (sem o token)
type SavedAccount = {
  id: string;
  email: string;
  displayName: string | null;
  lastUsed: string; // ISO date string
};

type AuthContextData = {
  session: Session | null;
  loading: boolean;
  savedAccounts: SavedAccount[];
  signIn: (session: Session) => void;
  signOut: () => void;
  switchAccount: (accountId: string) => Promise<void>;
  removeAccount: (accountId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({
  session: null,
  loading: true,
  savedAccounts: [],
  signIn: () => {},
  signOut: () => {},
  switchAccount: async () => {},
  removeAccount: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadState() {
      try {
        const storedAccounts = await AsyncStorage.getItem(SAVED_ACCOUNTS_KEY);
        const accounts: SavedAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];
        setSavedAccounts(accounts);

        const storedSession = await AsyncStorage.getItem(SESSION_KEY);
        if (storedSession) {
          const activeSession: Session = JSON.parse(storedSession);
          const token = await SecureStore.getItemAsync(activeSession.user.id);
          if (token) {
            setAuthToken(token);
            setSession(activeSession);
          }
        }
      } catch (e) {
        console.error("Failed to load session or accounts from storage", e);
      } finally {
        setLoading(false);
      }
    }

    loadState();
  }, []);

  const addAccount = async (newSession: Session) => {
    const { user, access_token } = newSession;
    await SecureStore.setItemAsync(user.id, access_token);

    setSavedAccounts(prevAccounts => {
      const newAccount: SavedAccount = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        lastUsed: new Date().toISOString(),
      };

      const existingAccountIndex = prevAccounts.findIndex(acc => acc.id === user.id);
      let updatedAccounts;

      if (existingAccountIndex > -1) {
        updatedAccounts = [...prevAccounts];
        updatedAccounts[existingAccountIndex] = newAccount;
      } else {
        updatedAccounts = [...prevAccounts, newAccount];
      }
      
      updatedAccounts.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
      AsyncStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
      return updatedAccounts;
    });
  };

  const signIn = async (newSession: Session) => {
    setSession(newSession);
    setAuthToken(newSession.access_token);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    await addAccount(newSession);
  };

  const signOut = async () => {
    setSession(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  const removeAccount = async (accountId: string) => {
    await SecureStore.deleteItemAsync(accountId);
    const updatedAccounts = savedAccounts.filter(acc => acc.id !== accountId);
    setSavedAccounts(updatedAccounts);
    await AsyncStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));

    if (session?.user.id === accountId) {
      signOut();
    }
  };

  const switchAccount = async (accountId: string) => {
    const accountInfo = savedAccounts.find(acc => acc.id === accountId);
    if (!accountInfo) throw new Error("Account not found");

    const token = await SecureStore.getItemAsync(accountId);
    if (!token) {
      await removeAccount(accountId);
      throw new Error("Token not found for account, please log in again.");
    }

    const newSession: Session = {
      access_token: token,
      user: {
        id: accountInfo.id,
        email: accountInfo.email,
        displayName: accountInfo.displayName,
      },
    };

    await signIn(newSession);
  };

  const segments = useSegments();
  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)/Login');
    }
  }, [session, segments, loading]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading, 
      savedAccounts,
      signIn,
      signOut,
      switchAccount,
      removeAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
