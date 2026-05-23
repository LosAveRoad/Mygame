"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/lib/game-store";
import Popup from "@/components/ui/Popup";
import type { CommRestriction } from "@/lib/types";

interface CommunicatorProps {
  position: { x: number; y: number };
  restriction: CommRestriction;
  onSendMessage: (message: string) => void;
}

export default function Communicator({ position, restriction, onSendMessage }: CommunicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const { chatHistory, levelState } = useGameStore();
  const level = useGameStore((s) => s.currentLevel);

  const maxChars = restriction.maxChars || 20;
  const messagesRemaining = level === 1
    ? (levelState as { messagesRemaining: number }).messagesRemaining
    : Infinity;

  const canSend = input.trim().length > 0 && !cooldown && messagesRemaining > 0;

  const handleSend = () => {
    if (!canSend) return;

    let finalMessage = input.trim();

    if (restriction.type === "signal_interference" && Math.random() < (restriction.interferenceRate || 0)) {
      const chars = finalMessage.split("");
      for (let i = 0; i < chars.length; i++) {
        if (Math.random() < 0.4) {
          chars[i] = "█";
        }
      }
      finalMessage = chars.join("");
    }

    onSendMessage(finalMessage);
    setInput("");

    if (restriction.type === "cooldown") {
      setCooldown(true);
      setTimeout(() => setCooldown(false), restriction.cooldownMs || 3000);
    }
  };

  return (
    <>
      <div
        className="absolute z-10 device-btn-glow"
        style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-game-surface border-2 border-terminal/40 rounded-lg p-2 text-center">
          <div className="text-lg">📡</div>
          <div className="text-terminal text-[8px] font-mono">COMM</div>
        </div>
      </div>

      {isOpen && (
        <Popup title="通讯仪" icon="📡" onClose={() => setIsOpen(false)}>
          <div className="max-h-48 overflow-y-auto mb-4 space-y-2 custom-scrollbar">
            {chatHistory.length === 0 && (
              <p className="text-hud-dim text-xs italic">信号已连接...</p>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "text-sm font-mono",
                  msg.role === "player" ? "text-terminal text-right" : "text-stella"
                )}
              >
                {msg.role === "player" ? (
                  <span className="text-terminal-dim text-xs mr-2">&gt;</span>
                ) : (
                  <span className="text-stella-dim text-xs mr-2">Stella:</span>
                )}
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
              placeholder="输入指令..."
              className="flex-1 bg-game-bg border border-game-border rounded px-3 py-2 text-terminal text-sm font-mono placeholder:text-hud-dim focus:outline-none focus:border-terminal/50"
              maxLength={maxChars}
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "px-4 py-2 rounded text-sm font-mono transition-colors",
                canSend
                  ? "bg-terminal/20 text-terminal hover:bg-terminal/30"
                  : "bg-game-border text-hud-dim cursor-not-allowed"
              )}
            >
              {cooldown ? "..." : "发送"}
            </button>
          </div>

          <div className="mt-2 text-xs text-hud-dim font-mono">
            {restriction.type === "char_limit" && (
              <span>{input.length}/{maxChars} 字 | 剩余 {messagesRemaining} 次</span>
            )}
            {restriction.type === "signal_interference" && (
              <span>⚠ 信号不稳定 | {input.length}/{maxChars} 字</span>
            )}
            {restriction.type === "cooldown" && (
              <span>{cooldown ? "冷却中..." : "就绪"} | 无限次</span>
            )}
          </div>
        </Popup>
      )}
    </>
  );
}
