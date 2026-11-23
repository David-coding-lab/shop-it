import { MaterialIcons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { ComponentRef } from "react";
import type { TextInputProps } from "react-native";

export const colors = {
  primary: "#7B2CBF",
  title: "#404040",
  subtext: "#A3A3A3",
  icon: "#8A8A8A",
  line: "#D4D4D4",
  error: "#DC2626",
};

type Props = Omit<TextInputProps, "style" | "className"> & {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  error?: string | null;
  password?: boolean;
};

const UnderlineField = forwardRef<ComponentRef<typeof TextInput>, Props>(function UnderlineField(
  { label, icon, error, password, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const active = focused;
  const lineColor = error ? colors.error : active ? colors.primary : colors.line;
  const iconColor = active ? colors.primary : colors.icon;

  return (
    <View className="gap-3">
      <Text className="font-rubik-medium text-[17px] text-ink">{label}</Text>

      <View
        className="h-11 flex-row items-center gap-2.5"
        style={{ borderBottomColor: lineColor, borderBottomWidth: active ? 2 : 1 }}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} />
        <View className="h-3.5 w-px bg-[#D4D4D4]" />
        <TextInput
          ref={ref}
          {...rest}
          secureTextEntry={password ? hidden : rest.secureTextEntry}
          placeholderTextColor={colors.subtext}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="h-11 flex-1 p-0 font-rubik text-base text-ink"
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <MaterialIcons
              name={hidden ? "visibility" : "visibility-off"}
              size={22}
              color={colors.icon}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text className="font-rubik text-[13px] text-[#DC2626]">{error}</Text> : null}
    </View>
  );
});

export default UnderlineField;
