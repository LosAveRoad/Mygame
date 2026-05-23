"use client";

import { cn } from "@/lib/utils";

interface PopupProps {
  title: string;
  icon?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Popup({ title, icon, onClose, children, className }: PopupProps) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className={cn("popup-panel", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="terminal-text text-sm font-bold tracking-wide">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </span>
          <button
            onClick={onClose}
            className="text-terminal-dim hover:text-terminal transition-colors text-lg"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
