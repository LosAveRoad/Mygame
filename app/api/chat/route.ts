import { NextRequest, NextResponse } from "next/server";
import { chatWithStella } from "@/lib/ai/chat";
import type { GameState } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, gameState } = body as {
      message: string;
      gameState: GameState;
    };

    if (!message || !gameState) {
      return NextResponse.json(
        { error: "Missing message or gameState" },
        { status: 400 }
      );
    }

    const response = await chatWithStella(gameState, message);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "...信号...干扰...听不清...",
        emotion: { fear: 5, trust: 0 },
        action: null,
      },
      { status: 200 }
    );
  }
}
