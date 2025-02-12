interface Card {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
    small: string;
  };
  card_faces?: Array<{
    image_uris: {
      normal: string;
      small: string;
    };
  }>;
  quantity: number;
  prices: {
    usd: string | null;
    usd_foil: string | null;
  };
}

interface PricedDeckSection {
  title: string;
  cards: Card[];
  totalValue: number;
}

interface DeckList {
  cards: Card[];
  total: number;
}

export type { Card, DeckList, PricedDeckSection };
