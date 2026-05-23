"use client";

import dynamic from "next/dynamic";
import { use3DStore } from "@/lib/3d-store";

const Scene3DContent = dynamic(() => import("@/components/3d/Scene3DContent"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100vw", height: "100vh", background: "#050810",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#4a9eff", fontFamily: "monospace", fontSize: 16,
    }}>
      Loading 3D Scene...
    </div>
  ),
});

export default function Scene3DPage() {
  const doorOpen = use3DStore((s) => s.doorOpen);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050810" }}>
      <Scene3DContent />

      {/* HUD overlay */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "#4a9eff",
        fontFamily: "monospace",
        fontSize: 14,
        zIndex: 10,
      }}>
        <div>3D PROTOTYPE — 密室场景</div>
        <div style={{ marginTop: 8, color: "#6a8aaa", fontSize: 12 }}>
          WASD / 方向键 — 移动
        </div>
        <div style={{ color: "#6a8aaa", fontSize: 12 }}>
          走近开关后点击 — 开/关
        </div>
      </div>

      {/* Door status */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        color: doorOpen ? "#44ff44" : "#ff4444",
        fontFamily: "monospace",
        fontSize: 14,
        zIndex: 10,
      }}>
        铁门: {doorOpen ? "已开启 ✓" : "锁定"}
      </div>
    </div>
  );
}
