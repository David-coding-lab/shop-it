import { useState } from "react";
import { Text } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { Spinner } from "@/components/ui/Spinner";
import type { ProfileState } from "@/features/profile/profile-state";
import type { Profile, ProfileUpdate } from "@/types/database.types";

export function ProfileForm({ profileState }: { profileState: ProfileState }) {
  const { profile, isLoading, isSaving, error, updateProfile } = profileState;

  if (isLoading) {
    return <Spinner className="py-10" />;
  }

  return (
    <ProfileFormFields
      key={profile?.id ?? "new"}
      profile={profile}
      isSaving={isSaving}
      loadError={error}
      onSave={updateProfile}
    />
  );
}

type ProfileFormFieldsProps = {
  profile: Profile | null;
  isSaving: boolean;
  loadError: string | null;
  onSave: (updates: ProfileUpdate) => Promise<{ error: string | null }>;
};

function ProfileFormFields({ profile, isSaving, loadError, onSave }: ProfileFormFieldsProps) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [isSaved, setIsSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSave() {
    setFormError(null);
    setIsSaved(false);

    const trimmedAvatar = avatarUrl.trim();
    if (trimmedAvatar && !/^https?:\/\/.+/i.test(trimmedAvatar)) {
      setFormError("Avatar URL must start with http:// or https://");
      return;
    }

    const result = await onSave({
      full_name: fullName.trim() || null,
      avatar_url: trimmedAvatar || null,
    });

    if (result.error) {
      setFormError(result.error);
      return;
    }
    setIsSaved(true);
  }

  const visibleError = formError ?? loadError;

  return (
    <Card className="gap-4">
      <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
        Edit profile
      </Text>

      <TextField
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Ada Lovelace"
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
      />
      <TextField
        label="Avatar URL"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        placeholder="https://example.com/avatar.png"
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {visibleError ? (
        <Text className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {visibleError}
        </Text>
      ) : null}
      {isSaved ? (
        <Text className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Profile saved.
        </Text>
      ) : null}

      <Button title="Save changes" onPress={handleSave} loading={isSaving} />
    </Card>
  );
}
