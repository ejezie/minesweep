import React from "react";
import styled from "styled-components";
import { Tile, Tiles } from "./Tile";

const BoardContainer = styled.section`
  background-color: rgb(15, 33, 46);
  padding: 40px;
`;

const StyledTile = styled.section`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

// set type for board components props
export interface BoardProps {
  tiles: Array<Tile>;
  inProgress: boolean;
  onClickTile?: (
    e: React.MouseEvent<HTMLButtonElement>,
    position: number
  ) => void;
}

export const Board: React.FC<BoardProps> = ({
  tiles,
  inProgress,
  onClickTile
}) => {
  return (
    <BoardContainer>
      <StyledTile>
        {tiles.map(({ type, squeeze }, index) => (
          <Tiles
            disabled={!inProgress}
            inProgress={inProgress}
            key={index}
            type={type}
            squeeze={squeeze}
            onClick={(e) => onClickTile && onClickTile(e, index + 1)}
          />
        ))}
      </StyledTile>
    </BoardContainer>
  );
};
