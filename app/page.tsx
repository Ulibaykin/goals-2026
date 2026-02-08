"use client";

import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");

  const isValid = phone.replace(/\D/g, "").length >= 11;

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-6">
      <div className="w-full max-w-sm space-y-10">
        {/* Заголовок */}
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            ТВОИ ЦЕЛИ НА ГОД
          </h1>
          <p className="text-neutral-400 text-base">
            трекер целей на год
          </p>
        </div>

        {/* Форма */}
        <div className="space-y-4">
          <input
            type="tel"
            placeholder="+7 ___ ___ __ __"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-4 text-lg outline-none focus:border-white transition"
          />

          <button
            disabled={!isValid}
            className={`w-full py-4 rounded-xl text-lg font-medium transition
              ${
                isValid
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }
            `}
          >
            Войти
          </button>
        </div>
      </div>
    </main>
  );
}
