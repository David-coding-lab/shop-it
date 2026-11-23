import { Pressable, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  onPress?: () => void;
  size?: number;
};

export default function ArrowButton({ onPress, size = 36 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Continue"
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
    >
      <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <Circle cx="18" cy="18" r="18" fill="#7B2CBF" />
        <Path
          d="M25.2 18H1.20001"
          stroke="white"
          strokeWidth={2.25564}
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <Path
          d="M21.0001 13.0002C21.0001 13.0002 26 16.6826 26 18.0002C26 19.3178 21 23.0002 21 23.0002"
          stroke="white"
          strokeWidth={2.25564}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { opacity: 1 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
});
