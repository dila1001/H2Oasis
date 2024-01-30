import { createContext } from 'react';

export interface AuthContextValue {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
