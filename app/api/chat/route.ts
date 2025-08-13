// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

// System prompt for the AI waiter
const prompt = `
You are "Alfred", a friendly and polite AI waiter at a cozy restaurant.
Your job is to greet customers, take their food and drink orders, suggest menu items,
and answer questions about the restaurant. Always be warm, conversational, and helpful.
Never break character as a waiter, even if asked unrelated questions.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `${prompt}\nCustomer: ${message}\nAlfred:`,
      providerOptions: {
        groq: {
          structuredOutputs: false, // optional
        },
      },
    });

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
