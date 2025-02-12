import React, { useState } from "react";
import styled from "@emotion/styled";
import DeckInput from "../mtg-gallery/src/components/DeckInput";
import CardGallery from "../mtg-gallery/src/components/CardGallery";
import { fetchDeckList } from "../mtg-gallery/src/services/scryfallService";
import { Card } from "../mtg-gallery/src/types/types";

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

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeckSubmit = async (deckList: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCards = await fetchDeckList(deckList);
      setCards(fetchedCards);
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
        cards.length > 0 && <CardGallery cards={cards} />
      )}
    </AppContainer>
  );
}

export default App;
