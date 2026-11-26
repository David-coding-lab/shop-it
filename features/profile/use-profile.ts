import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/use-auth";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/features/profile/profile-schemas";
import { firstErrorMessage } from "@/lib/validation";
import type { Profile } from "@/types/database.types";

type ProfileResult = { profile: Profile | null; error: string | null };

async function loadProfile(userId: string | null): Promise<ProfileResult> {
  if (!userId) {
    return { profile: null, error: null };
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { profile: null, error: error.message };
  }
  return { profile: data, error: null };
}

export function useProfile() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadProfile(userId).then((result) => {
      if (cancelled) return;
      setProfile(result.profile);
      setError(result.error);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await loadProfile(userId);
    setProfile(result.profile);
    setError(result.error);
    setIsLoading(false);
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: ProfileUpdateInput) => {
      if (!userId) return { error: "Not signed in." };

      const parsed = profileUpdateSchema.safeParse(updates);
      if (!parsed.success) {
        return { error: firstErrorMessage(parsed.error) };
      }

      setIsSaving(true);
      setError(null);
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(parsed.data)
        .eq("id", userId)
        .select()
        .single();
      setIsSaving(false);

      if (updateError) {
        setError(updateError.message);
        return { error: updateError.message };
      }
      setProfile(data);
      return { error: null };
    },
    [userId],
  );

  return { profile, isLoading, isSaving, error, refresh, updateProfile };
}
