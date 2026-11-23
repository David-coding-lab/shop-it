import Svg, { Circle, G, Path, Rect } from "react-native-svg";

type Props = {
  width?: number;
};

export default function EmailIllustration({ width = 220 }: Props) {
  const height = (width * 180) / 220;

  return (
    <Svg width={width} height={height} viewBox="0 0 220 180" fill="none">
      <Circle cx="110" cy="96" r="72" fill="#F3E8FF" />
      <Rect x="46" y="66" width="128" height="84" rx="12" fill="#FFFFFF" stroke="#7B2CBF" strokeWidth="4" />
      <Path d="M52 72L110 118L168 72" stroke="#7B2CBF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M52 144L91 110" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" />
      <Path d="M168 144L129 110" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" />
      <G opacity="0.9">
        <Circle cx="162" cy="52" r="18" fill="#7B2CBF" />
        <Path d="M154 52L160 58L170 46" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}
