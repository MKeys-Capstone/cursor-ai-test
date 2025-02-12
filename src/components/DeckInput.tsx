import React, { useState } from "react";
import styled from "@emotion/styled";

const InputContainer = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #357abd;
  }
`;

interface DeckInputProps {
  onSubmit: (decklist: string) => void;
}

export default function DeckInput({ onSubmit }: DeckInputProps) {
  const [deckList, setDeckList] = useState("");

  const handleSubmit = () => {
    if (deckList.trim()) {
      onSubmit(deckList);
    }
  };

  return (
    <InputContainer>
      <h2>Enter your decklist</h2>
      <p>
        Enter one card per line with quantity (e.g., "4 Lightning Bolt" or "2x
        Mountain")
      </p>
      <StyledTextarea
        value={deckList}
        onChange={(e) => setDeckList(e.target.value)}
        placeholder="4 Lightning Bolt&#13;&#10;3 Mountain&#13;&#10;2x Island"
      />
      <SubmitButton onClick={handleSubmit}>Load Deck</SubmitButton>
    </InputContainer>
  );
}
