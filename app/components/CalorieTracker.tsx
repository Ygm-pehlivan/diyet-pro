"use client";

import { useState } from "react";

interface MealItem {
  id: number;
  isim: string;
  kalori: number;
}

interface CalorieTrackerProps {
  onTotalCalorieUpdate: (toplam: number) => void;
}

export default function CalorieTracker({ onTotalCalorieUpdate }: CalorieTrackerProps) {
  const [yemekAdi, setYemekAdi] = useState("");
  const [kaloriDegeri, setKaloriDegeri] = useState("");
  const [ogunler, setOgunler] = useState<MealItem[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  const aiIeHesapla = async () => {
    if (!yemekAdi.trim()) return;

    setYukleniyor(true);
    try {
      const res = await fetch("/api/ai-kalori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yemek: yemekAdi }),
      });

      const data = await res.json();
      const kaloriSayi = Number(data.kalori) || 250;
      setKaloriDegeri(kaloriSayi.toString());
    } catch (err) {
      console.error("Kalori AI çağrısı hatası:", err);
      setKaloriDegeri("250");
    } finally {
      setYukleniyor(false);
    }
  };

  const ogunEkle = () => {
    if (!yemekAdi || !kaloriDegeri) return;
    
    const yeniItem: MealItem = {
      id: Date.now(),
      isim: yemekAdi,
      kalori: parseInt(kaloriDegeri) || 0,
    };

    const yeniOgunler = [...ogunler, yeniItem];
    setOgunler(yeniOgunler);
    onTotalCalorieUpdate(yeniOgunler.reduce((top, item) => top + item.kalori, 0));

    setYemekAdi("");
    setKaloriDegeri("");
  };

  const toplamKalori = ogunler.reduce((toplam, item) => toplam + item.kalori, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-emerald-700 mb-2">Günlük Kalori Takibi & Gemini AI</h2>
      <p className="text-sm text-slate-500 mb-4">Yediğin yemeği yaz, Gemini yapay zekası kalorisini anında hesaplasın.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="sm:col-span-2 relative">
          <input 
            type="text" 
            placeholder="Yemek adı (Örn: Tost)" 
            value={yemekAdi}
            onChange={(e) => setYemekAdi(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
          />
          <button 
            onClick={aiIeHesapla}
            disabled={yukleniyor}
            className="absolute right-2 top-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
          >
            {yukleniyor ? "Hesaplanıyor..." : "✨ AI ile Hesapla"}
          </button>
        </div>

        <input 
          type="number" 
          placeholder="Kalori (kcal)" 
          value={kaloriDegeri}
          onChange={(e) => setKaloriDegeri(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500"
        />
      </div>

      <button onClick={ogunEkle} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm transition shadow-sm mb-4">
        Öğüne Ekle
      </button>

      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-4 text-sm">
        <span>Toplam Alınan: <strong className="text-emerald-600 font-bold">{toplamKalori}</strong> kcal</span>
        <span>Hedef: <strong className="text-slate-700 font-bold">2000</strong> kcal</span>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {ogunler.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-slate-50/80 px-4 py-2.5 rounded-xl text-sm border border-slate-100">
            <span className="text-slate-700 font-medium">🍽️ {item.isim}</span>
            <span className="text-emerald-700 font-semibold">{item.kalori} kcal</span>
          </div>
        ))}
      </div>
    </div>
  );
}