import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Ideally, this is strictly strictly process.env.API_KEY as per instructions.
// We initialize the client inside the function to ensure we capture the env var at runtime.

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY not found in environment variables.");
      // In a real app we might throw, but for the UI to render we might just log.
      // However, the instructions say 'Assume this variable is pre-configured'.
    }
    client = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-ui-dev' });
  }
  return client;
};

export const initializeChat = (): Chat => {
    const ai = getClient();
    chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2, // Low temp for precise code
            maxOutputTokens: 8000,
        },
        history: [
            {
                role: 'user',
                parts: [{ text: "Initialize as the Elite Google Apps Script Architect." }]
            },
            {
                role: 'model',
                parts: [{ text: "Architecture systems online. Elite Google Apps Script Architect ready. Awaiting directive. Priority 1 protocols engaged." }]
            }
        ]
    });
    return chatSession;
};

export const sendMessageStream = async function* (message: string) {
    if (!chatSession) {
        initializeChat();
    }
    
    if (!chatSession) {
        throw new Error("Failed to initialize chat session");
    }

    try {
        const result = await chatSession.sendMessageStream({ message });
        
        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};