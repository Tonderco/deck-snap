import { renderHook, act } from "@testing-library/react";
import { useDeck } from "@/hooks/useDeck";

// Minimal fetch stubs
const initResp = { success: true, deck_id: "abc", remaining: 52 };
const cardA = { code:"AS", image:"", suit:"SPADES", value:"ACE" };
const cardK = { code:"KH", image:"", suit:"HEARTS", value:"KING" };

describe("useDeck probabilities", () => {
    beforeEach(() => {
        let step = 0;
        global.fetch = jest.fn((url: RequestInfo) => {
            const u = String(url);
            if (u.includes("/new/shuffle")) {
                return Promise.resolve(new Response(JSON.stringify({ success: true, deck_id: "abc", remaining: 52 }), { headers: { "Content-Type": "application/json" } }));
            }
            if (u.includes("/draw")) {
                step++;
                const payload = step === 1
                    ? { cards: [{ code:"AS", image:"", suit:"SPADES", value:"ACE" }], remaining: 51 }
                    : { cards: [{ code:"KH", image:"", suit:"HEARTS", value:"KING" }], remaining: 50 };
                return Promise.resolve(new Response(JSON.stringify({ success: true, deck_id: "abc", ...payload }), { headers: { "Content-Type": "application/json" } }));
            }
            if (u.includes("/shuffle")) {
                return Promise.resolve(new Response(JSON.stringify({ remaining: 52 }), { headers: { "Content-Type": "application/json" } }));
            }
            return Promise.reject(new Error("unexpected fetch"));
        }) as unknown as typeof fetch;
    });

    it("computes value/suit/either after a draw", async () => {
        const { result } = renderHook(() => useDeck());
        await act(async () => { await result.current.draw(); }); // drew ACE of SPADES

        // After first draw, remaining=51
        const p = result.current.probabilities;
        // With one ACE of SPADES out, we expect:
        // valueRemaining = 3; suitRemaining = 12; either = 15; denominator = 51
        expect(Math.round(p.value * 51)).toBe(3);
        expect(Math.round(p.suit  * 51)).toBe(12);
        expect(Math.round(p.either* 51)).toBe(15);
    });
});
