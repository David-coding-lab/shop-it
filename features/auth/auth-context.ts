import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

import type { SignInInput, SignUpInput } from "@/features/auth/auth-schemas";

export type AuthResult = { error: string | null };

export type SignUpResult = AuthResult & { needsConfirmation: boolean };

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (input: SignInInput) => Promise<AuthResult>;
  signUp: (input: SignUpInput) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  resendConfirmation: (email: string) => Promise<AuthResult>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
