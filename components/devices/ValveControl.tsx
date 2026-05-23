"use client";

import { useState } from "react";
import Popup from "@/components/ui/Popup";

interface ValveControlProps {
  position: { x: number; y: number };
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
  onSendMessage: (message: string) => void;
}

export default function ValveControl({
  position, label, value, min, max, onChange, onSendMessage,
}: ValveControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdjust = (delta: number) => {
    const newVal = Math.max(min, Math.min(max, value + delta));
    onChange(newVal);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <>
      <div
        className="absolute z-10 device-btn-glow"
        style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-game-surface border-2 border-terminal/40 rounded-lg p-3 text-center">
          <div className="text-lg">🔧</div>
          <div className="text-terminal text-[7px] font-mono">{label}</div>
          <div className="text-terminal-dim text-[10px] font-mono mt-1">{value.toFixed(0)}%</div>
        </div>
      </div>

      {isOpen && (
        <Popup title={label} icon="🔧" onClose={() => setIsOpen(false)}>
          <div className="mb-4">
            <div className="flex justify-between text-xs font-mono text-hud-dim mb-1">
              <span>{min}</span>
              <span className="text-terminal">{value.toFixed(0)}%</span>
              <span>{max}</span>
            </div>
            <div className="progress-bar h-4">
              <div
                className="progress-bar-fill bg-terminal/60"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => handleAdjust(-5)}
              className="px-4 py-2 bg-danger/20 text-danger rounded hover:bg-danger/30 font-mono text-sm"
            >
              -5
            </button>
            <button
              onClick={() => handleAdjust(-1)}
              className="px-4 py-2 bg-danger/10 text-danger/80 rounded hover:bg-danger/20 font-mono text-sm"
            >
              -1
            </button>
            <button
              onClick={() => handleAdjust(1)}
              className="px-4 py-2 bg-safe/10 text-safe/80 rounded hover:bg-safe/20 font-mono text-sm"
            >
              +1
            </button>
            <button
              onClick={() => handleAdjust(5)}
              className="px-4 py-2 bg-safe/20 text-safe rounded hover:bg-safe/30 font-mono text-sm"
            >
              +5
            </button>
          </div>

          <div className="border-t border-game-border pt-3">
            <p className="text-hud-dim text-xs mb-2 font-mono">或发送指令给 Stella：</p>
            <div className="flex gap-2">
              <button
                onClick={() => { onSendMessage(`微调${label}，保持平衡`); setIsOpen(false); }}
                className="flex-1 py-2 bg-terminal/10 text-terminal rounded text-xs font-mono hover:bg-terminal/20"
              >
                微调
              </button>
              <button
                onClick={() => { onSendMessage(`死守${label}，别管另一个`); setIsOpen(false); }}
                className="flex-1 py-2 bg-warning/10 text-warning rounded text-xs font-mono hover:bg-warning/20"
              >
                死守
              </button>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
