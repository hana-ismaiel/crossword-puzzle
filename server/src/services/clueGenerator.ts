import { GoogleGenAI, Type } from "@google/genai";

export async function generateClues(words: string[]): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are generating crossword puzzle clues.
  For each word in this list, write one short, plain, simple dictionary-style definition clue.
  Do not use the word itself or an obvious variant of it in the clue.
  Words: ${words.join(", ")}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: Object.fromEntries(
          words.map((w) => [w, { type: Type.STRING }])
        ),
        required: words,
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned no usable content");
  }

  const clues: Record<string, string> = JSON.parse(response.text);
  return clues;
}