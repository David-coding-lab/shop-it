import { Image, ImageStyle, StyleProp } from "react-native";

// The artwork is the exact 264x256 window of your clipped SVG (the paper plane sticks out to the
// right, so the frame is wider than the envelope). The envelope's centre sits at ~37.2% of the
// frame, so the image is nudged right to put the envelope, not the frame, in the middle.
const ASPECT_RATIO = 264 / 256;
const ENVELOPE_CENTER = 98.25 / 264;

type Props = {
  width?: number;
  style?: StyleProp<ImageStyle>;
};

export default function EmailIllustration({ width = 264, style }: Props) {
  return (
    <Image
      source={require("../assets/email-sent-plane.png")}
      accessibilityLabel="Email with a paper plane"
      resizeMode="contain"
      style={[
        { width, height: width / ASPECT_RATIO, transform: [{ translateX: (0.5 - ENVELOPE_CENTER) * width }] },
        style,
      ]}
    />
  );
}
