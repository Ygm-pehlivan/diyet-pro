import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const yemek = body?.yemek;

    if (!yemek) {
      return NextResponse.json({ kalori: 250 }, { status: 200 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Bu yemeğin ortalama kalori miktarını sadece sayı olarak yaz, başka hiçbir şey yazma: "${yemek}"`,
    });

    const text = response.text?.trim() || "250";
    const kaloriSayi = parseInt(text.replace(/[^0-9]/g, "")) || 250;

    return NextResponse.json({ kalori: kaloriSayi });
  } catch (error) {
    console.error("AI Kalori Hatası:", error);
    // Hata durumunda uygulamanın çökmemesi için varsayılan bir değer döndürüyoruz
    return NextResponse.json({ kalori: 300 });
  }
}