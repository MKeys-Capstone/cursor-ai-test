import axios from "axios";
import { Card } from "../types/types";

const SCRYFALL_API = "https://api.scryfall.com";
const BATCH_SIZE = 75; // Scryfall's maximum batch size

interface CardIdentifier {
  name: string;
}

interface CollectionRequest {
  identifiers: CardIdentifier[];
}

export async function getCardByName(cardName: string): Promise<Card> {
  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/named`, {
      params: { fuzzy: cardName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching card:", error);
    throw error;
  }
}

export function parseDeckList(
  text: string
): { name: string; quantity: number }[] {
  // Split the text into lines and filter out empty lines
  const lines = text.split("\n").filter((line) => line.trim());

  return lines.map((line) => {
    // Match patterns like "4 Lightning Bolt" or "2x Mountain"
    const match = line.match(/^(\d+)(?:x|\s+)(.+)$/);
    if (match) {
      return {
        quantity: parseInt(match[1], 10),
        name: match[2].trim(),
      };
    }
    // If no match, assume quantity of 1
    return {
      quantity: 1,
      name: line.trim(),
    };
  });
}

// Helper function to chunk array into smaller arrays
function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size)
  );
}

async function fetchCardBatch(cardNames: string[]): Promise<Card[]> {
  try {
    // Split card names into chunks of BATCH_SIZE
    const chunks = chunkArray(cardNames, BATCH_SIZE);
    const allCards: Card[] = [];

    // Process each chunk sequentially to avoid rate limiting
    for (const chunk of chunks) {
      const identifiers: CardIdentifier[] = chunk.map((name) => ({ name }));
      const request: CollectionRequest = { identifiers };

      const response = await axios.post(
        `${SCRYFALL_API}/cards/collection`,
        request
      );

      allCards.push(...response.data.data);

      // Add a small delay between chunks if there are more to process
      if (chunks.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    return allCards;
  } catch (error) {
    console.error("Error fetching card batch:", error);
    throw error;
  }
}

export async function fetchDeckList(text: string): Promise<Card[]> {
  const cardList = parseDeckList(text);
  const uniqueCards = Array.from(new Set(cardList.map((card) => card.name)));

  try {
    // Fetch all cards in batches
    const fetchedCards = await fetchCardBatch(uniqueCards);

    // Add quantities to the fetched cards
    return fetchedCards.map((card) => {
      const quantity =
        cardList.find((c) => c.name.toLowerCase() === card.name.toLowerCase())
          ?.quantity || 1;
      return { ...card, quantity };
    });
  } catch (error) {
    console.error("Failed to fetch deck:", error);
    throw error;
  }
}
