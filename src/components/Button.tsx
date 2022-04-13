import React from "react";
import styled from "styled-components";

export const ButtonContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(33, 55, 67);
`;

export const StyledButton = styled.button<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  border-radius: 50px;
  padding: 20px;
  margin: 20px;
  border: none;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.5 ease-in;
  &:hover {
    background-color: green;
    color: white;
  }
`;

//  set type for props
export interface ButtonProps {
  inProgress: boolean;
  cashoutAvailable: boolean;
  onBet?: () => void;
  onCashout?: () => void;
}

export const Button = ({
  inProgress,
  onBet,
  onCashout,
  cashoutAvailable
}: ButtonProps) => {
  return (
    <ButtonContainer>
      {!inProgress ? (
        <StyledButton
          backgroundColor="rgb(31, 255, 32)"
          onClick={() => onBet && onBet()}
        >
          Bet
        </StyledButton>
      ) : (
        <StyledButton
          backgroundColor="rgb(255,255,0)"
          disabled={!cashoutAvailable}
          onClick={() => onCashout && onCashout()}
        >
          Cashout
        </StyledButton>
      )}
    </ButtonContainer>
  );
};
