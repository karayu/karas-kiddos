import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

export function getGemini() {
  return new GoogleGenerativeAI(apiKey);
}


