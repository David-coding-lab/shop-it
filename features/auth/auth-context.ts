import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthResult = { error: string | null };

export type SignUpResult = AuthResult & { needsConfirmation: boolean };

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
