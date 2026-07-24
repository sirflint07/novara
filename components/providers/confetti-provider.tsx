"use client";

import { useConfetti } from "@/hooks/use-confetti";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";

export const ConfettiProvider = () => {
  const confetti = useConfetti();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      className="pointer-events-none fixed inset-0 z-100"
      numberOfPieces={600}
      recycle={false}
      colors={[
        "#4F46E5", // Indigo
        "#7C3AED", // Purple
        "#EC4899", // Pink
        "#EF4444", // Red
        "#F59E0B", // Amber
        "#10B981", // Emerald
        "#3B82F6", // Blue
        "#00FF00", // Green
        "#964B00", // Brown
      ]}
      onConfettiComplete={() => {
        confetti.onClose()
      }}
    />
  );
};