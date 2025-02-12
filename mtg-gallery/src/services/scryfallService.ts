import axios from "axios";
import { Card } from "../types/types";

const SCRYFALL_API = "https://api.scryfall.com";

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

export async function fetchDeckList(text: string): Promise<Card[]> {
  const cardList = parseDeckList(text);
  const uniqueCards = Array.from(new Set(cardList.map((card) => card.name)));

  const cards: Card[] = [];

  for (const cardName of uniqueCards) {
    try {
      const card = await getCardByName(cardName);
      const quantity = cardList.find((c) => c.name === cardName)?.quantity || 1;
      cards.push({ ...card, quantity });
    } catch (error) {
      console.error(`Failed to fetch card: ${cardName}`, error);
    }
  }

  return cards;
}
