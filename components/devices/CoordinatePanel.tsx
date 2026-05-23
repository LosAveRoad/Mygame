"use client";

import { useState } from "react";
import { useGameStore } from "@/lib/game-store";
import Popup from "@/components/ui/Popup";
import type { CommRestriction } from "@/lib/types";

interface CoordinatePanelProps {
  position: { x: number; y: number };
  restriction: CommRestriction;
  onSendMessage: (message: string) => void;
}

export default function CoordinatePanel({ position, restriction, onSendMessage }: CoordinatePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { chatHistory } = useGameStore();
  const maxChars = restriction.maxChars || 30;

  const handleSend = () => {
    if (!input.trim()) return;
    let finalMessage = input.trim();

    if (restriction.type === "signal_interference" && Math.random() < (restriction.interferenceRate || 0)) {
      const chars = finalMessage.split("");
      for (let i = 0; i < chars.length; i++) {
        if (Math.random() < 0.4) chars[i] = "█";
      }
      finalMessage = chars.join("");
    }

    onSendMessage(finalMessage);
    setInput("");
  };

  return (
    <>
      <div
        className="absolute z-10 device-btn-glow"
        style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-game-surface border-2 border-terminal/40 rounded-lg p-2 text-center">
          <div className="text-lg">📍</div>
          <div className="text-terminal text-[8px] font-mono">坐标</div>
        </div>
      </div>

      {isOpen && (
        <Popup title="坐标面板" icon="📍" onClose={() => setIsOpen(false)}>
          <div className="max-h-40 overflow-y-auto mb-4 space-y-2 custom-scrollbar">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`text-sm font-mono ${msg.role === "player" ? "text-terminal text-right" : "text-stella"}`}
              >
                {msg.role === "stella" && <span className="text-stella-dim text-xs mr-2">Stella:</span>}
                {msg.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="输入坐标或提示..."
              className="flex-1 bg-game-bg border border-game-border rounded px-3 py-2 text-terminal text-sm font-mono placeholder:text-hud-dim focus:outline-none focus:border-terminal/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-2 rounded text-sm font-mono bg-terminal/20 text-terminal hover:bg-terminal/30 disabled:opacity-50"
            >
              发送
            </button>
          </div>

          <div className="mt-2 text-xs text-hud-dim font-mono">
            ⚠ 信号不稳定 | {input.length}/{maxChars}
          </div>
        </Popup>
      )}
    </>
  );
}
