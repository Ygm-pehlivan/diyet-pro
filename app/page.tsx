"use client";

import { useState } from "react";
import VkeCard from "@/app/components/VkeCard";
import CalorieTracker from "@/app/components/CalorieTracker";
import CardioTracker from "@/app/components/CardioTracker";
import DietListCard from "@/app/components/DietListCard";

export default function Dashboard() {
  const [suMiktar, setSuMiktar] = useState(0);
  const [vkeDurum, setVkeDurum] = useState("Belirtilmedi");
  const [toplamKalori, setToplamKalori] = useState(0);
  const [toplamKardiyo, setToplamKardiyo] = useState(0);

  const [aiTavsiye, setAiTavsiye] = useState<string>("Kişisel verilerine göre günlük hedeflerini analiz edelim.");
  const [yukleniyorKoç, setYukleniyorKoç] = useState(false);
  const suHedefi = 2500;

  const suEkle = (miktar: number) => {
    setSuMiktar((mevcut) => (mevcut + miktar > suHedefi ? suHedefi : mevcut + miktar));
  };

  const tavsiyeAl = async () => {
    setYukleniyorKoç(true);
    try {
      const res = await fetch("/api/ai-koc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          vke: vkeDurum, 
          kalori: toplamKalori, 
          kardiyo: toplamKardiyo 
        }),
      });
      const data = await res.json();
      setAiTavsiye(data.tavsiye);
    } catch (err) {
      console.error(err);
      setAiTavsiye("Bağlantı hatası oluştu.");
    } finally {
      setYukleniyorKoç(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <header className="bg-emerald-600 text-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-wide">🌱 DiyetPro Asistanı</h1>
        <div className="flex gap-3">
          <button className="bg-emerald-700 hover:bg-emerald-800 text-xs px-4 py-2 rounded-lg transition-colors font-medium">
            🔔 Bildirimler
          </button>
          <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-bold text-sm">
            YP
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sol Sütun (VKE, Kalori, Kardiyo ve Diyet Listesi) */}
        <div className="md:col-span-2 space-y-6">
          <VkeCard onVkeUpdate={setVkeDurum} />
          <CalorieTracker onTotalCalorieUpdate={setToplamKalori} />
          <CardioTracker onTotalCardioUpdate={setToplamKardiyo} />
          
          {/* Yeni Eklenen Diyet Listesi Kartı */}
          <DietListCard 
            vkeDurum={vkeDurum} 
            toplamKalori={toplamKalori} 
            toplamKardiyo={toplamKardiyo} 
          />
        </div>

        {/* Sağ Sütun (Su Takibi ve AI Koç) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h2 className="text-lg font-semibold text-emerald-700 mb-4">Günün Su Tüketimi 💧</h2>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-sky-500">{suMiktar}</span>
              <span className="text-slate-400 font-medium"> / {suHedefi} ml</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-4 mb-6 overflow-hidden">
              <div 
                className="bg-sky-500 h-4 transition-all duration-500 ease-out"
                style={{ width: `${(suMiktar / suHedefi) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-center gap-3">
              <button onClick={() => suEkle(250)} className="bg-sky-50 hover:bg-sky-100 text-sky-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">+250 ml</button>
              <button onClick={() => suEkle(500)} className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">+500 ml</button>
              <button onClick={() => setSuMiktar(0)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">Sıfırla</button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              🤖 AI Sağlık Koçu
            </h2>
            <p className="text-sm text-emerald-50 mb-4 opacity-90 min-h-[40px]">
              {yukleniyorKoç ? "Koçun verilerini inceliyor..." : aiTavsiye}
            </p>
            <button 
              onClick={tavsiyeAl}
              disabled={yukleniyorKoç}
              className="w-full bg-white text-emerald-700 hover:bg-emerald-50 py-3 rounded-xl text-sm font-bold transition shadow-sm"
            >
              {yukleniyorKoç ? "Analiz Ediliyor..." : "Tavsiye İste"}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}