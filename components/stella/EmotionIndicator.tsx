"use client";

interface EmotionIndicatorProps {
  fear: number;
  trust: number;
}

export default function EmotionIndicator({ fear, trust }: EmotionIndicatorProps) {
  let emoji = "😊";
  if (fear > 80) emoji = "😰";
  else if (fear > 60) emoji = "😟";
  else if (fear > 40) emoji = "😐";
  else if (fear > 20) emoji = "🙂";

  if (trust > 80 && fear < 30) emoji = "🥰";

  return (
    <div className="text-center animate-pulse-glow">
      <span className="text-sm">{emoji}</span>
    </div>
  );
}
