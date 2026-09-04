import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { vke, kalori, kardiyo } = await request.json();

    const prompt = `Sen profesyonel bir diyetisyen ve yaşam koçusun. Kullanıcının günlük verileri şu şekildedir:
    - Vücut Kitle Endeksi (VKE) Durumu: ${vke || "Belirtilmedi"}
    - Alınan Toplam Kalori: ${kalori || 0} kcal
    - Yapılan Kardiyo Süresi: ${kardiyo || 0} dakika

    Bu verilere dayanarak kullanıcıya samimi, motive edici ve 2-3 cümlelik kısa, profesyonel bir beslenme ve egzersiz tavsiyesi ver.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const tavsiye = response.text?.trim() || "Harika gidiyorsun, su içmeyi ve hareket etmeyi unutma!";

    return NextResponse.json({ tavsiye });
  } catch (error) {
    console.error("AI Koç Hatası:", error);
    return NextResponse.json({ tavsiye: "Şu anda koçunuza ulaşılamıyor, ancak hedefleriniz için harika iş çıkarıyorsunuz!" });
  }
}