export type ApiCard = {
    code: string;        // e.g. "AS"
    image: string;       // URL
    suit: "SPADES" | "HEARTS" | "DIAMONDS" | "CLUBS";
    value: "ACE" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "JACK" | "QUEEN" | "KING";
};

type InitResp = { success: boolean; deck_id: string; remaining: number };
type DrawResp = { success: boolean; deck_id: string; cards: ApiCard[]; remaining: number };

const BASE = "https://deckofcardsapi.com/api/deck";

export async function initDeck(): Promise<{ deckId: string; remaining: number }> {
    const res = await fetch(`${BASE}/new/shuffle/?deck_count=1`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to initialize deck");
    const data: InitResp = await res.json();
    return { deckId: data.deck_id, remaining: data.remaining };
}

export async function drawOne(deckId: string): Promise<{ card: ApiCard; remaining: number }> {
    const res = await fetch(`${BASE}/${deckId}/draw/?count=1`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to draw card");
    const data: DrawResp = await res.json();
    return { card: data.cards[0], remaining: data.remaining };
}

export async function reshuffle(deckId: string): Promise<number> {
    const res = await fetch(`${BASE}/${deckId}/shuffle/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to reshuffle deck");
    const json = await res.json();
    return json.remaining as number;
}
