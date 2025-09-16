import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import React from "react";

jest.mock("@/hooks/useDeck", () => ({
    useDeck: () => ({
        current: null,
        previous: null,
        remaining: 52,
        probabilities: { value: 0, suit: 0, either: 0 },
        snap: { value: false, suit: false, both: false },
        isLoading: false,
        draw: jest.fn(),
        reset: jest.fn(),
        ensureDeck: jest.fn(),
        counterText: "52 cards ready",
    }),
}));

it("renders headings and controls", () => {
    render(<Page />);
    expect(screen.getByText(/Deck Snap/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Draw card/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reshuffle/i })).toBeInTheDocument();
    expect(screen.getByText(/52 cards ready/i)).toBeInTheDocument();
});
