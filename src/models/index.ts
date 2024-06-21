import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OpenAI } from "@langchain/openai";

export const mistral = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral", // Default value
  format: "json",
});

export const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
