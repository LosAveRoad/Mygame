import OpenAI from "openai";
import type { AIResponse, GameState } from "../types";
import { buildSystemPrompt, buildMessages } from "./prompt-builder";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export async function chatWithStella(
  state: GameState,
  playerMessage: string
): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(state);
  const history = buildMessages(state.chatHistory);

  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: playerMessage },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content || "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as AIResponse;
      return {
        reply: parsed.reply || "...",
        emotion: {
          fear: Math.max(-30, Math.min(30, parsed.emotion?.fear || 0)),
          trust: Math.max(-30, Math.min(30, parsed.emotion?.trust || 0)),
        },
        action: parsed.action || null,
      };
    }
  } catch {
    // fallback
  }

  return {
    reply: content,
    emotion: { fear: 0, trust: 0 },
    action: null,
  };
}
