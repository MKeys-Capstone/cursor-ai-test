import React from "react";
import styled from "@emotion/styled";
import { Card } from "../types/types";

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  padding: 20px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    padding: 10px;
  }
`;

const CardContainer = styled.div`
  position: relative;
  text-align: center;
  cursor: pointer;
`;

const CardImage = styled.img<{ isSelected: boolean }>`
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: ${(props) =>
    props.isSelected
      ? "0 0 0 3px #4CAF50, 0 2px 4px rgba(0, 0, 0, 0.2)"
      : "0 2px 4px rgba(0, 0, 0, 0.2)"};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardQuantity = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
`;

const CardCheckbox = styled.input`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const CardPrice = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #357abd;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
`;

interface CardGalleryProps {
  cards: Card[];
  selectedCards: { [key: string]: boolean };
  onToggleCard: (cardName: string) => void;
}

export default function CardGallery({
  cards,
  selectedCards,
  onToggleCard,
}: CardGalleryProps) {
  const handleCardClick = (e: React.MouseEvent, cardName: string) => {
    // If clicking the checkbox directly, don't handle the click here
    if ((e.target as HTMLElement).tagName === "INPUT") {
      return;
    }
    onToggleCard(cardName);
  };

  return (
    <GalleryContainer>
      {cards.map((card) => (
        <CardContainer
          key={card.id}
          onClick={(e) => handleCardClick(e, card.name)}
        >
          <CardImage
            src={
              card.image_uris?.normal ||
              card.card_faces?.[0].image_uris.normal ||
              "https://c2.scryfall.com/file/scryfall-card-backs/large/59/597b79b3-7d77-4261-871a-60dd17403388.jpg"
            }
            alt={card.name}
            isSelected={selectedCards[card.name] || false}
          />
          <CardQuantity>{card.quantity}x</CardQuantity>
          <CardCheckbox
            type="checkbox"
            checked={selectedCards[card.name] || false}
            onChange={() => onToggleCard(card.name)}
          />
          <CardPrice>${card.prices.usd || "0.00"}</CardPrice>
        </CardContainer>
      ))}
    </GalleryContainer>
  );
}
