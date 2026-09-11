import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

export async function POST(request: Request) {
  try {
    const { vke, kalori, kardiyo } = await request.json();

    if (!ai) {
      console.warn("GEMINI_API_KEY tanımlı değil. Diyet listesi için varsayılan cevap dönülüyor.");
      return NextResponse.json({
        liste: "AI bağlantısı hazır değil. .env.local içinde GEMINI_API_KEY tanımlayıp tekrar deneyin.",
      }, { status: 503 });
    }

    const prompt = `Sen profesyonel bir diyetisyensin. Kullanıcının profili:
    - Vücut Kitle Endeksi (VKE) Durumu: ${vke || "Normal"}
    - Günlük Alınan Kalori: ${kalori || 0} kcal
    - Yapılan Günlük Kardiyo: ${kardiyo || 0} dakika

    Bu bilgilere dayanarak kullanıcıya özel, sabah, öğle ve akşam öğünlerini içeren örnek ve sağlıklı 1 günlük kişiselleştirilmiş diyet listesi hazırla. Madde işaretleri kullanarak kısa ve anlaşılır yaz.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const liste = response.text?.trim() || "Diyet listesi oluşturulamadı.";
    return NextResponse.json({ liste });
  } catch (error) {
    console.error("AI Diyet Hatası:", error);
    return NextResponse.json({ liste: "Şu anda diyet listesi oluşturulamıyor." });
  }
}