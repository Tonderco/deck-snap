"use client";

import { useCallback, useMemo, useState } from "react";
import { ApiCard, initDeck, drawOne, reshuffle } from "@/lib/deckApi";

type Snap = { value: boolean; suit: boolean; both: boolean };

export function useDeck() {
    const [deckId, setDeckId] = useState<string | null>(null);
    const [previous, setPrevious] = useState<ApiCard | null>(null);
    const [current, setCurrent] = useState<ApiCard | null>(null);
    const [remaining, setRemaining] = useState<number>(52);
    const [drawnByValue, setDrawnByValue] = useState<Record<string, number>>({});
    const [drawnBySuit, setDrawnBySuit] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(false);

    const ensureDeck = useCallback(async () => {
        if (deckId) return deckId;
        setIsLoading(true);
        try {
            const { deckId: id, remaining } = await initDeck();
            setDeckId(id);
            setRemaining(remaining);
            return id;
        } finally {
            setIsLoading(false);
        }
    }, [deckId]);

    const computeSnap = useCallback((prev: ApiCard | null, cur: ApiCard | null): Snap => {
        if (!prev || !cur) return { value: false, suit: false, both: false };
        const value = prev.value === cur.value;
        const suit = prev.suit === cur.suit;
        return { value, suit, both: value && suit };
    }, []);

    const probabilities = useMemo(() => {
        if (!current || remaining <= 0) return { value: 0, suit: 0, either: 0 };
        const vCount = (drawnByValue[current.value] ?? 0) - 1; // exclude current
        const sCount = (drawnBySuit[current.suit] ?? 0) - 1;   // exclude current

        const valueRemaining = Math.max(0, 3 - Math.max(0, vCount));
        const suitRemaining  = Math.max(0, 12 - Math.max(0, sCount));
        const eitherRemaining = valueRemaining + suitRemaining;

        return {
            value: remaining > 0 ? valueRemaining / remaining : 0,
            suit: remaining > 0 ? suitRemaining  / remaining : 0,
            either: remaining > 0 ? eitherRemaining / remaining : 0,
        };
    }, [current, remaining, drawnByValue, drawnBySuit]);

    const draw = useCallback(async () => {
        const id = await ensureDeck();
        if (remaining <= 0 || !id) return;

        setIsLoading(true);
        try {
            const { card, remaining: newRemaining } = await drawOne(id);
            setPrevious((p) => (current ? current : p));
            setCurrent(card);
            setRemaining(newRemaining);

            setDrawnByValue((m) => ({ ...m, [card.value]: (m[card.value] ?? 0) + 1 }));
            setDrawnBySuit((m) => ({ ...m, [card.suit]: (m[card.suit] ?? 0) + 1 }));
        } finally {
            setIsLoading(false);
        }
    }, [ensureDeck, current, remaining]);

    const reset = useCallback(async () => {
        const id = await ensureDeck();
        setIsLoading(true);
        try {
            const newRemaining = await reshuffle(id);
            setPrevious(null);
            setCurrent(null);
            setRemaining(newRemaining);
            setDrawnByValue({});
            setDrawnBySuit({});
        } finally {
            setIsLoading(false);
        }
    }, [ensureDeck]);

    const snap = useMemo(() => computeSnap(previous, current), [computeSnap, previous, current]);

    return {
        deckId, previous, current, remaining, snap, probabilities, isLoading,
        draw, reset, ensureDeck,
        counterText: current ? `Card ${52 - remaining} of 52` : `52 cards ready`,
    };
}
