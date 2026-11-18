import { Text, View } from "react-native";

type AvatarProps = {
  name?: string | null;
  email?: string | null;
  size?: number;
};

function getInitials(name?: string | null, email?: string | null): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
    return initials.join("") || "?";
  }
  const emailInitial = email?.trim()[0]?.toUpperCase();
  return emailInitial ?? "?";
}

export function Avatar({ name, email, size = 64 }: AvatarProps) {
  return (
    <View
      className="items-center justify-center bg-indigo-600"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text
        className="font-semibold text-white"
        style={{ fontSize: Math.round(size * 0.38) }}
      >
        {getInitials(name, email)}
      </Text>
    </View>
  );
}
