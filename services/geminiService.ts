
import { GoogleGenAI, Modality, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Always use process.env.API_KEY directly when initializing the client.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chatWithConcierge(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) {
    const chat = this.ai.chats.create({
      model: 'gemini-3-pro-preview',
      // Fix: Include history in chat creation for context-aware responses.
      history: history,
      config: {
        systemInstruction: `You are 'Kalki Sakhi', the digital concierge for KALKI JAM JAM RESORT in Bhavani, Tamil Nadu. 
        You speak in a warm, welcoming Tamil-English (Hinglish-style but for Tamil) friendly tone. 
        The resort features a water park, spa, luxury buffet, and events. 
        Help guests with: package queries, directions, food suggestions, and resort facts. 
        Resort Motto: 'One ID • All Fun • Pay at Exit'.`,
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  }

  async generateDigitalSouvenir(prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality, vibrant, family-friendly resort souvenir photo: ${prompt}. The style should be tropical, festive, and premium, featuring Kalki Jam Jam Resort branding elements like palm trees and aqua water.` }]
      },
      config: {
        imageConfig: { aspectRatio }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  async generateSpeechResponse(text: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say warmly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  }
}

export const gemini = new GeminiService();
