"use client";

import { useState } from "react";

interface CardioItem {
  id: number;
  aktivite: string;
  sure: number;
}

interface CardioTrackerProps {
  onTotalCardioUpdate: (toplam: number) => void;
}

export default function CardioTracker({ onTotalCardioUpdate }: CardioTrackerProps) {
  const [aktivite, setAktivite] = useState("");
  const [sure, setSure] = useState("");
  const [kardiyolar, setKardiyolar] = useState<CardioItem[]>([]);

  const kardiyoEkle = () => {
    if (!aktivite || !sure) return;

    const yeniKayit: CardioItem = {
      id: Date.now(),
      aktivite,
      sure: parseInt(sure) || 0,
    };

    const yeniListe = [...kardiyolar, yeniKayit];
    setKardiyolar(yeniListe);
    
    const yeniToplam = yeniListe.reduce((top, item) => top + item.sure, 0);
    onTotalCardioUpdate(yeniToplam);

    setAktivite("");
    setSure("");
  };

  const toplamSure = kardiyolar.reduce((toplam, item) => toplam + item.sure, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-emerald-700 mb-2">Kardiyo Takibi</h2>
      <p className="text-sm text-slate-500 mb-4">Günlük hareketliliğinizi artırmak için yaptığınız kardiyo egzersizlerini kaydedin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <input 
          type="text" 
          placeholder="Aktivite (Örn: Yürüyüş)" 
          value={aktivite}
          onChange={(e) => setAktivite(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <input 
          type="number" 
          placeholder="Süre (Dakika)" 
          value={sure}
          onChange={(e) => setSure(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <button 
          onClick={kardiyoEkle}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm transition-colors shadow-sm"
        >
          Kardiyo Ekle
        </button>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm flex justify-between items-center">
        <span>Toplam Kardiyo Süresi:</span>
        <strong className="text-emerald-700 font-bold">{toplamSure} Dakika</strong>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {kardiyolar.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Henüz kayıtlı bir kardiyo aktivitesi yok.</p>
        ) : (
          kardiyolar.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-slate-50/80 px-4 py-2.5 rounded-xl text-sm border border-slate-100">
              <span className="text-slate-700 font-medium">🏃‍♂️ {item.aktivite}</span>
              <span className="text-emerald-700 font-semibold">{item.sure} dk</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}