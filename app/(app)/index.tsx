import { Text, View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/use-auth";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <Screen className="px-6">
      <View className="flex-1 justify-center gap-6">
        <Text className="text-center text-3xl font-jakarta-bold text-brand-950 dark:text-neutral-50">
          Shop-it
        </Text>
        <Text className="text-center font-jakarta text-neutral-500 dark:text-neutral-400">
          Signed in as {user?.email ?? "your account"}
        </Text>
        <Button title="Sign out" variant="secondary" onPress={() => void signOut()} />
      </View>
    </Screen>
  );
}
