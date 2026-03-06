// app/api/assistant/route.ts
import OpenAI from "openai";
import { portfolioContext } from "@/lib/portfolioContext";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:  process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return Response.json({ reply: null }, { status: 400 });
    }

    // Build conversation with full history for context
    const messages = [
      {
        role:    "system" as const,
        content: portfolioContext,
      },
      // Previous turns (max 10 pairs to keep context window light)
      ...history.slice(-20).map((m: { role: string; content: string }) => ({
        role:    m.role as "user" | "assistant",
        content: m.content,
      })),
      {
        role:    "user" as const,
        content: message,
      },
    ];

    const completion = await client.chat.completions.create({
      model:       "meta-llama/llama-3-8b-instruct",
      messages,
      max_tokens:  600,
      temperature: 0.75,
    });

    const reply = completion.choices[0]?.message?.content ?? "Maaf, saya tidak bisa memproses pertanyaan itu 😅";

    return Response.json({ reply });

  } catch (error: unknown) {
    console.error("[Assistant API Error]:", error);
    return Response.json(
      { reply: "AI sedang bermasalah, coba lagi sebentar ya! 😅" },
      { status: 500 }
    );
  }
}