
import { GoogleGenAI } from "@google/genai";
import { MedicineAnalysis, DiagnosisResult, MealPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMedicine(base64Image: string): Promise<MedicineAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this medicine packaging image for authenticity, specifically for the Pakistani market.
    Identify:
    1. Drug Name
    2. Batch Number / Expiry (if visible)
    3. Indicators of counterfeit: Check for blurry printing, inconsistent fonts, spelling errors, or poor quality packaging common in fake drugs.
    
    Return the result in JSON format with the following structure:
    {
      "isCounterfeit": boolean,
      "confidence": number (0-1),
      "reasoning": "Detailed explanation of findings",
      "drugName": "Name of drug",
      "batchInfo": "Batch/Expiry details",
      "warnings": ["warning 1", "warning 2"]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function checkSymptoms(history: { role: 'user' | 'model', text: string }[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are SehatGuard AI, a medical assistant focused on common illnesses in Pakistan like Dengue, Malaria, and Typhoid.
    Your goal is to help users identify potential symptoms and guide them.
    Always clarify that you are an AI and not a doctor.
    Keep responses empathetic and clear.
    If the symptoms sound like Dengue (fever, eye pain, rash), Malaria (chills, sweats), or Typhoid (prolonged fever, stomach pain), mention them as possibilities and advise seeing a doctor.
  `;

  const chat = ai.chats.create({
    model,
    config: { systemInstruction }
  });

  // Since we are not doing a full chat session here for simplicity in this helper, 
  // we just send the latest context or use the chat object if we wanted to maintain state.
  // We'll pass the whole history to a fresh prompt for now or assume this helper is called per message.
  
  const lastMessage = history[history.length - 1].text;
  const result = await chat.sendMessage({ message: lastMessage });
  
  return result.text || "I'm sorry, I couldn't process that. Please try again.";
}

export async function getNutritionPlan(condition: string): Promise<MealPlan> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Provide a detailed recovery nutrition plan for a patient in Pakistan suffering from: ${condition}.
    Focus on locally available foods (e.g., Khichdi, Papaya leaf extract for Dengue, ORS, etc.).
    Return raw JSON with exactly this structure:
    {
      "condition": "${condition}",
      "foodsToInclude": ["food1", "food2"],
      "foodsToAvoid": ["food1", "food2"],
      "sampleMealPlan": {
        "breakfast": "...",
        "lunch": "...",
        "dinner": "...",
        "snacks": ["...", "..."]
      }
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}
