"use client";

import CardImage from "@/components/CardImage";
import { useDeck } from "@/hooks/useDeck";
import { useEffect, useRef } from "react";

export default function Page() {
  const { current, previous, remaining, snap, probabilities, draw, reset, counterText, ensureDeck, isLoading } = useDeck();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { ensureDeck(); }, [ensureDeck]);

  useEffect(() => {
    if (snap.both || snap.value || snap.suit) {
      audioRef.current?.play().catch(() => {});
    }
  }, [snap]);

  const snapText =
      snap.both ? "SNAP BOTH!" :
          snap.value ? "SNAP VALUE!" :
              snap.suit ? "SNAP SUIT!" : "";

  return (
      <main className="min-h-dvh bg-slate-100 text-slate-900">
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Deck Snap</h1>

          <div className="flex gap-8 justify-center">
            <CardImage label="Previous" src={previous?.image} />
            <CardImage label="Current"  src={current?.image} />
          </div>

          <div className="min-h-8 flex items-center justify-center">
            {snapText && (
                <div className="px-4 py-2 rounded-lg bg-yellow-200 text-yellow-900 font-bold animate-[fade_150ms_ease]">
                  {snapText}
                </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
                onClick={draw}
                disabled={isLoading || remaining <= 0}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow disabled:opacity-50"
            >
              {remaining > 0 ? "Draw card" : "No cards left"}
            </button>
            <button
                onClick={reset}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-slate-200 shadow"
            >
              Reshuffle
            </button>

            <div className="text-sm text-slate-600">{counterText}{remaining === 0 ? " — deck empty" : ""}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Prob title="P(value match)" value={probabilities.value} />
            <Prob title="P(suit match)"  value={probabilities.suit}  />
            <Prob title="P(either)"       value={probabilities.either}/>
          </div>

          {/* lightweight sound */}
          <audio ref={audioRef} src="/snap.mp3" preload="auto" />
        </div>
      </main>
  );
}

function Prob({ title, value }: { title: string; value: number }) {
  const pct = (value * 100).toFixed(1);
  return (
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl font-semibold">{pct}%</div>
      </div>
  );
}
