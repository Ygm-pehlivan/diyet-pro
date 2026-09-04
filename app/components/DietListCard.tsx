"use client";

import { useState } from "react";

interface DietListCardProps {
  vkeDurum: string;
  toplamKalori: number;
  toplamKardiyo: number;
}

export default function DietListCard({ vkeDurum, toplamKalori, toplamKardiyo }: DietListCardProps) {
  const [diyetListesi, setDiyetListesi] = useState<string>("Verilerine uygun kişiselleştirilmiş diyet listesi oluşturmak için butona tıkla.");
  const [yukleniyor, setYukleniyor] = useState(false);

  const listeGetir = async () => {
    setYukleniyor(true);
    try {
      const res = await fetch("/api/ai-diyet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vke: vkeDurum, kalori: toplamKalori, kardiyo: toplamKardiyo }),
      });
      const data = await res.json();
      setDiyetListesi(data.liste);
    } catch (err) {
      console.error(err);
      setDiyetListesi("Bağlantı hatası oluştu.");
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-emerald-700 mb-2">🍽️ Kişiselleştirilmiş AI Diyet Listesi</h2>
      <p className="text-sm text-slate-500 mb-4">VKE ve günlük aktivitelerine göre yapay zekanın sana özel hazırlayacağı beslenme programı.</p>

      <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 mb-4 whitespace-pre-line min-h-[100px] border border-slate-100">
        {yukleniyor ? "Yapay zeka sana özel diyet listesini hazırlıyor..." : diyetListesi}
      </div>

      <button 
        onClick={listeGetir}
        disabled={yukleniyor}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm transition shadow-sm"
      >
        {yukleniyor ? "Hazırlanıyor..." : "Özel Diyet Listesi Oluştur"}
      </button>
    </div>
  );
}