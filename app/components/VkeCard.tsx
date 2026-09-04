"use client";

import { useState } from "react";

interface VkeCardProps {
  onVkeUpdate: (durum: string) => void;
}

export default function VkeCard({ onVkeUpdate }: VkeCardProps) {
  const [kilo, setKilo] = useState<string>("");
  const [boy, setBoy] = useState<string>("");
  const [yas, setYas] = useState<string>("");
  const [sonuc, setSonuc] = useState<{ vke: string; durum: string } | null>(null);

  const hesapla = () => {
    const k = parseFloat(kilo);
    const b = parseFloat(boy);

    if (!k || !b || k <= 0 || b <= 0) {
      alert("Lütfen geçerli bir kilo ve boy girin.");
      return;
    }

    const boyM = b / 100;
    const vkeDegeri = k / (boyM * boyM);
    const vkeStr = vkeDegeri.toFixed(1);

    let durumStr = "";
    if (vkeDegeri < 18.5) durumStr = "Zayıf";
    else if (vkeDegeri >= 18.5 && vkeDegeri < 24.9) durumStr = "Normal Kilolu";
    else if (vkeDegeri >= 25 && vkeDegeri < 29.9) durumStr = "Kilolu";
    else durumStr = "Obez";

    setSonuc({ vke: vkeStr, durum: durumStr });
    onVkeUpdate(durumStr);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-emerald-700 mb-2">Vücut Kitle Endeksi (VKE) & Profil</h2>
      <p className="text-sm text-slate-500 mb-4">Boy, kilo ve yaş bilgilerinizi girerek ideal değerlerinizi hesaplayın.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <input 
          type="number" 
          placeholder="Kilo (kg)" 
          value={kilo}
          onChange={(e) => setKilo(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <input 
          type="number" 
          placeholder="Boy (cm)" 
          value={boy}
          onChange={(e) => setBoy(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
        <input 
          type="number" 
          placeholder="Yaş" 
          value={yas}
          onChange={(e) => setYas(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <button 
        onClick={hesapla}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl text-sm transition-colors shadow-sm"
      >
        VKE Hesapla
      </button>

      {sonuc && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center text-sm">
          <span className="text-emerald-800 font-medium">Vücut Kitle Endeksiniz:</span>
          <span className="font-bold text-emerald-900 bg-white px-3 py-1 rounded-lg shadow-xs">
            {sonuc.vke} ({sonuc.durum})
          </span>
        </div>
      )}
    </div>
  );
}