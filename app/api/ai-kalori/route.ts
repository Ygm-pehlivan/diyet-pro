import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const yemek = body?.yemek;

    if (!yemek) {
      return NextResponse.json({ kalori: 250 }, { status: 200 });
    }

    if (!ai) {
      console.warn("GEMINI_API_KEY tanımlı değil. Varsayılan kalori değeri döndürülüyor.");
      return NextResponse.json({ kalori: 250 }, { status: 503 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Bu yemeğin ortalama kalori miktarını sadece sayı olarak yaz, başka hiçbir şey yazma: "${yemek}"`,
    });

    const text = response.text?.trim() || "250";
    const kaloriSayi = Number.parseInt(text.replace(/[^0-9]/g, ""), 10) || 250;

    return NextResponse.json({ kalori: kaloriSayi });
  } catch (error) {
    console.error("AI Kalori Hatası:", error);
    return NextResponse.json({ kalori: 300 });
  }
}