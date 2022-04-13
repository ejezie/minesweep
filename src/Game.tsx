import React from "react";
import styled from "styled-components";
import { Board, BoardProps } from "./components/Board";
import { Button, ButtonProps } from "./components/Button";

const GameContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 50px;
  grid-template-columns: minmax(0, 300px) auto;
  overflow: hidden;
`;

interface GameProps extends BoardProps, ButtonProps {}

const Game: React.FC<GameProps> = ({
  tiles,
  inProgress,
  onBet,
  onCashout,
  onClickTile,
  cashoutAvailable
}) => {
  return (
    <GameContainer>
      <Button
        cashoutAvailable={cashoutAvailable}
        onBet={onBet}
        onCashout={onCashout}
        inProgress={inProgress}
      />
      <Board inProgress={inProgress} tiles={tiles} onClickTile={onClickTile} />
    </GameContainer>
  );
};

export default Game;
