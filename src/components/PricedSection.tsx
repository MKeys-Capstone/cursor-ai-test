import React, { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import { PricedDeckSection } from "../types/types";
import CardGallery from "./CardGallery";

const SectionContainer = styled.div`
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const SectionHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: beige;
  cursor: pointer;

  &:hover {
    background-color: gray;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: black;
`;

const TotalValue = styled.span`
  font-weight: bold;
  color: #357abd;
`;

const ContentContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "none" : "0")};
  transition: max-height 0.3s ease-in-out;
  overflow: ${(props) => (props.isOpen ? "visible" : "hidden")};
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StyledIconButton = styled(IconButton)`
  color: #4caf50;
  padding: 8px;

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

interface PricedSectionProps {
  section: PricedDeckSection;
}

export default function PricedSection({ section }: PricedSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCards, setSelectedCards] = useState<{
    [key: string]: boolean;
  }>({});

  const handleHeaderClick = (e: React.MouseEvent) => {
    // Prevent toggling when clicking the download button
    if ((e.target as HTMLElement).closest("button")) {
      e.stopPropagation();
      return;
    }
    setIsOpen(!isOpen);
  };

  const toggleCard = (cardName: string) => {
    setSelectedCards((prev) => ({
      ...prev,
      [cardName]: !prev[cardName],
    }));
  };

  const downloadChecklist = () => {
    const checklist = section.cards
      .map(
        (card) =>
          `[${selectedCards[card.name] ? "x" : " "}] ${card.quantity}x ${
            card.name
          } - $${card.prices.usd || "0.00"}`
      )
      .join("\n");

    const header = `${
      section.title
    }\nTotal Value: $${section.totalValue.toFixed(2)}\n\n`;
    const content = header + checklist;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${section.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-checklist.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SectionContainer>
      <SectionHeader isOpen={isOpen} onClick={handleHeaderClick}>
        <SectionTitle>{section.title}</SectionTitle>
        <HeaderControls onClick={(e) => e.stopPropagation()}>
          <TotalValue>
            Total: ${section.totalValue.toFixed(2)} ({section.cards.length}{" "}
            cards)
          </TotalValue>
          <StyledIconButton
            onClick={downloadChecklist}
            size="small"
            title="Download Checklist"
          >
            <DownloadIcon />
          </StyledIconButton>
        </HeaderControls>
      </SectionHeader>
      <ContentContainer isOpen={isOpen}>
        <CardGallery
          cards={section.cards}
          selectedCards={selectedCards}
          onToggleCard={toggleCard}
        />
      </ContentContainer>
    </SectionContainer>
  );
}
