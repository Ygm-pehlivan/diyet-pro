import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function POST(request: Request) {
  try {
    const { vke, kalori, kardiyo } = await request.json();

    if (!ai) {
      console.warn("GEMINI_API_KEY tanımlı değil. Koç önerisi için varsayılan cevap dönülüyor.");
      return NextResponse.json({
        tavsiye: "AI bağlantısı henüz hazır değil. API anahtarını .env.local dosyasına ekleyip tekrar deneyin.",
      }, { status: 503 });
    }

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