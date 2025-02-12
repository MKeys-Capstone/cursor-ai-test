import React, { useState } from "react";
import styled from "@emotion/styled";
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
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const TotalValue = styled.span`
  font-weight: bold;
  color: #357abd;
`;

const ContentContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? "2000px" : "0")};
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
`;

interface PricedSectionProps {
  section: PricedDeckSection;
}

export default function PricedSection({ section }: PricedSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SectionContainer>
      <SectionHeader isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <SectionTitle>{section.title}</SectionTitle>
        <TotalValue>
          Total: ${section.totalValue.toFixed(2)} ({section.cards.length} cards)
        </TotalValue>
      </SectionHeader>
      <ContentContainer isOpen={isOpen}>
        <CardGallery cards={section.cards} />
      </ContentContainer>
    </SectionContainer>
  );
}
