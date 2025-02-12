import React, { useState } from "react";
import styled from "@emotion/styled";
import DeckInput from "./components/DeckInput";
import PricedSection from "./components/PricedSection";
import { fetchDeckList } from "./services/scryfallService";
import { Card, PricedDeckSection } from "./types/types";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
`;

function organizeDeckByPrice(cards: Card[]): PricedDeckSection[] {
  const sections: PricedDeckSection[] = [
    { title: "Budget Cards (Under $1)", cards: [], totalValue: 0 },
    { title: "Mid-Range Cards ($1-$5)", cards: [], totalValue: 0 },
    { title: "Premium Cards (Over $5)", cards: [], totalValue: 0 },
  ];

  cards.forEach((card) => {
    const price = parseFloat(card.prices.usd || "0");
    const totalPrice = price * card.quantity;

    if (price <= 1) {
      sections[0].cards.push(card);
      sections[0].totalValue += totalPrice;
    } else if (price <= 5) {
      sections[1].cards.push(card);
      sections[1].totalValue += totalPrice;
    } else {
      sections[2].cards.push(card);
      sections[2].totalValue += totalPrice;
    }
  });

  return sections.filter((section) => section.cards.length > 0);
}

function App() {
  const [pricedSections, setPricedSections] = useState<PricedDeckSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeckSubmit = async (deckList: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCards = await fetchDeckList(deckList);
      const organizedSections = organizeDeckByPrice(fetchedCards);
      setPricedSections(organizedSections);
    } catch (err) {
      setError(
        "Failed to load deck. Please check your decklist and try again."
      );
      console.error("Error loading deck:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Header>
        <h1>MTG Deck Viewer</h1>
      </Header>

      <DeckInput onSubmit={handleDeckSubmit} />

      {error && (
        <div style={{ color: "red", textAlign: "center", margin: "20px 0" }}>
          {error}
        </div>
      )}

      {loading ? (
        <LoadingMessage>Loading cards...</LoadingMessage>
      ) : (
        pricedSections.map((section, index) => (
          <PricedSection key={index} section={section} />
        ))
      )}
    </AppContainer>
  );
}

export default App;
