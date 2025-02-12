import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const tapUntapAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  75% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Card = styled.div`
  width: 63px; // Standard MTG card ratio 63x88
  height: 88px;
  background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
  border-radius: 4px;
  border: 2px solid #8b4513;
  position: relative;
  transform-origin: center center;
  animation: ${tapUntapAnimation} 2s infinite;

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    background: radial-gradient(circle at center, #d4af37, #b8860b);
    border-radius: 2px;
    opacity: 0.7;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23000' stroke-width='8'/%3E%3Cpath d='M50 5 L50 95 M5 50 L95 50' stroke='%23000' stroke-width='8'/%3E%3C/svg%3E");
    background-size: contain;
    opacity: 0.8;
  }
`;

const LoadingText = styled.div`
  color: #8b4513;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Summoning cards...",
}) => {
  return (
    <SpinnerContainer>
      <Card />
      <LoadingText>{message}</LoadingText>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
