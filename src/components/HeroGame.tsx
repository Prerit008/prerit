"use client";

import { useEffect, useState } from "react";

const symbols = ["✦", "●", "▲", "◆", "✿", "★"];

type Card = {
  id: number;
  symbol: string;
  matched: boolean;
};

function createDeck(): Card[] {
  return [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, id) => ({
      id,
      symbol,
      matched: false,
    }));
}

export default function HeroGame() {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [first, second] = flipped;
    const isMatch = cards[first].symbol === cards[second].symbol;

    const timer = setTimeout(() => {
      setCards((current) =>
        current.map((card, index) =>
          index === first || index === second
            ? { ...card, matched: isMatch }
            : card,
        ),
      );
      setFlipped([]);
    }, 700);

    return () => clearTimeout(timer);
  }, [flipped, cards]);

  function handleCardClick(index: number) {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      cards[index].matched
    ) {
      return;
    }

    setFlipped((current) => [...current, index]);
    setMoves((current) => current + 1);
  }

  function resetGame() {
    setCards(createDeck());
    setFlipped([]);
    setMoves(0);
  }

  const isComplete = cards.every((card) => card.matched);

  return (
    <div className="hero-game">
      <div className="hero-game-header">
        <span>MEMORY GAME</span>
        <span>{moves} MOVES</span>
      </div>

      <div className="hero-game-grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || card.matched;

          return (
            <button
              key={card.id}
              type="button"
              className={`hero-game-card ${isFlipped ? "is-flipped" : ""}`}
              onClick={() => handleCardClick(index)}
              aria-label={isFlipped ? `Card ${card.symbol}` : "Hidden card"}
            >
              {isFlipped ? card.symbol : "?"}
            </button>
          );
        })}
      </div>

      <div className="hero-game-footer">
        {isComplete ? (
          <span className="hero-game-complete">YOU DID IT!</span>
        ) : (
          <span>FIND ALL PAIRS</span>
        )}

        <button type="button" onClick={resetGame}>
          NEW GAME ↗
        </button>
      </div>
    </div>
  );
}
