import { useCallback, useEffect, useState } from "react";

export function useCooldown(durationSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const start = useCallback(() => {
    setSecondsLeft(durationSeconds);
  }, [durationSeconds]);

  return {
    secondsLeft,
    isCoolingDown: secondsLeft > 0,
    start,
  };
}
