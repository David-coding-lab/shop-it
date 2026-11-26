import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/features/auth/auth-context";
import { signInSchema, signUpPayloadSchema } from "@/features/auth/auth-schemas";
import type { SignInInput, SignUpInput } from "@/features/auth/auth-schemas";
import { emailSchema, firstErrorMessage } from "@/lib/validation";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        console.warn("[auth] getSession failed", error);
        if (!mounted) return;
        setSession(null);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const parsed = signInSchema.safeParse(input);
    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const parsed = signUpPayloadSchema.safeParse(input);
    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error), needsConfirmation: false };
    }

    const { email, password, fullName, phone } = parsed.data;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    return {
      error: error?.message ?? null,
      needsConfirmation: !error && !data.session,
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data);
    return { error: error?.message ?? null };
  }, []);

  const resendConfirmation = useCallback(async (email: string) => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      return { error: firstErrorMessage(parsed.error) };
    }

    const { error } = await supabase.auth.resend({ type: "signup", email: parsed.data });
    return { error: error?.message ?? null };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendConfirmation,
    }),
    [session, isLoading, signIn, signUp, signOut, resetPassword, resendConfirmation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
