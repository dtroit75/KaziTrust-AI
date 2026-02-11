
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper for decoding base64 to Uint8Array
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper for PCM decoding
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Creates a WAV file blob from raw PCM data (16-bit, mono, 24000Hz)
 */
export function createWavBlob(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 32 + pcmData.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte Rate (SampleRate * 1 channel * 2 bytes)
  view.setUint16(32, 2, true); // Block Align
  view.setUint16(34, 16, true); // Bits Per Sample
  writeString(36, 'data');
  view.setUint32(40, pcmData.length, true);

  return new Blob([header, pcmData], { type: 'audio/wav' });
}

export const geminiService = {
  /**
   * Fetches the speech audio bytes from Gemini.
   * Minimal prompt to improve response time.
   */
  async fetchSpeech(text: string): Promise<Uint8Array | null> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio ? decodeBase64(base64Audio) : null;
  },

  async translateLegalese(text: string, targetLang: Language): Promise<any> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Translate the following legal text related to Kenyan labor laws into ${targetLang}. 
      Focus on making it easy to understand for a domestic worker in Nairobi. 
      Also provide a brief explanation of what it means for them and cite relevant sections if known (e.g., Employment Act 2007).
      
      Return as JSON with:
      {
        "translated": "...",
        "explanation": "...",
        "citations": ["..."]
      }
      
      Text: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translated: { type: Type.STRING },
            explanation: { type: Type.STRING },
            citations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async searchLaborLaws(query: string, targetLang: Language = Language.ENGLISH) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search for the latest Kenyan labor laws and domestic worker regulations regarding: ${query}. 
      Ensure the context is specific to Nairobi and current year. 
      Provide your response in ${targetLang}. 
      Focus on making the answer clear, compassionate, and actionable for a worker.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Legal Source',
        uri: chunk.web?.uri
      }))
      .filter((s: any) => s.uri) || [];

    return {
      text: response.text,
      sources
    };
  },

  async analyzeMedia(base64Data: string, mimeType: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: "Analyze this document image or video of a labor contract. Summarize the key terms, list any potential red flags or warnings for a domestic worker in Kenya, and extract the key points." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  },

  async chatWithWorker(history: { role: string, parts: { text: string }[] }[], message: string) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: "You are KaziTrust AI, an expert advisor for domestic workers in Nairobi, Kenya. You specialize in Kenyan labor laws (Employment Act, Domestic Workers Regulations). You provide helpful, compassionate, and legally sound advice in simple terms. You can communicate in English, Kiswahili, and Sheng. If asked about a dispute, suggest mediation or legal aid paths like KUDHEIHA or FIDA Kenya."
      }
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  }
};
