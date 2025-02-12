import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import DeckInput from "./components/DeckInput";
import PricedSection from "./components/PricedSection";
import LoadingSpinner from "./components/LoadingSpinner";
import { fetchDeckList } from "./services/scryfallService";
import { Card, PricedDeckSection } from "./types/types";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const StorageInfo = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  margin-left: 10px;

  &:hover {
    color: #ff0000;
  }
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

const STORAGE_KEY = "mtg-deck-viewer-data";

function App() {
  const [pricedSections, setPricedSections] = useState<PricedDeckSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load saved deck data on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { sections, timestamp } = JSON.parse(savedData);
        setPricedSections(sections);
        setLastUpdated(new Date(timestamp).toLocaleString());
      } catch (err) {
        console.error("Error loading saved deck:", err);
      }
    }
  }, []);

  const handleDeckSubmit = async (deckList: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCards = await fetchDeckList(deckList);
      const organizedSections = organizeDeckByPrice(fetchedCards);
      setPricedSections(organizedSections);

      // Save to local storage
      const timestamp = new Date().toISOString();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sections: organizedSections,
          timestamp,
        })
      );
      setLastUpdated(new Date(timestamp).toLocaleString());
    } catch (err) {
      setError(
        "Failed to load deck. Please check your decklist and try again."
      );
      console.error("Error loading deck:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSavedDeck = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPricedSections([]);
    setLastUpdated(null);
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

      {lastUpdated && (
        <StorageInfo>
          Last updated: {lastUpdated}
          <ClearButton onClick={clearSavedDeck}>Clear saved deck</ClearButton>
        </StorageInfo>
      )}

      <ContentContainer>
        {loading ? (
          <LoadingSpinner message="Tapping for mana to find cards..." />
        ) : (
          pricedSections.map((section, index) => (
            <PricedSection key={index} section={section} />
          ))
        )}
      </ContentContainer>
    </AppContainer>
  );
}

export default App;
