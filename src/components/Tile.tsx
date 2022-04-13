import React from "react";
import styled from "styled-components";
import "../styles.css";
import { Howl } from "howler";
import { Gem, Mine, gem_audio, mine_audio } from "../assets/index";

// using an attribute to give all instance of button tiles props
const TileContainer = styled.button.attrs(
  // set attribute types
  ({
    inProgress,
    revealed,
    squeeze
  }: {
    inProgress: boolean;
    revealed: boolean;
    squeeze: boolean;
  }) => {
    const colorBase = "rgb(54, 83, 99)";
    const colorDark = "rgb(33, 55, 67)";
    const borderBottomBase = "rgb(37, 61, 77)";
    const opacityRevealed = "1";
    const opacityNotRevealed = "0.3";
    const animationRevealed = "animate 1s linear infinite";

    // Setting background based on revealed application state
    const backgroundColor = inProgress
      ? revealed
        ? colorBase
        : colorDark
      : revealed && !squeeze
      ? colorDark
      : colorBase;

    // Setting Opacity based on revealed application state
    const opacity = inProgress
      ? revealed
        ? opacityRevealed
        : opacityNotRevealed
      : revealed && !squeeze
      ? opacityRevealed
      : opacityNotRevealed;

    // Setting animation based on revealed application state when in progress
    const animate = inProgress && revealed ? animationRevealed : null;

    const borderBottom = squeeze || revealed ? colorDark : borderBottomBase;

    const size = squeeze ? 70 : 90;

    return {
      inProgress,
      revealed,
      squeeze,
      backgroundColor,
      borderBottom,
      size,
      opacity,
      animate
    };
  }
)`
  aspect-ratio: 1;
  border-width: 0;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor};
  opacity: ${(props) => props.opacity};
  animation: ${(props) => props.animate};
  border-bottom: 5px solid ${(props) => props.borderBottom};
  > * {
    width: ${(props) => props.size}%;
    height: ${(props) => props.size}%;
  }

  @keyframes animate {
    0% {
      height: 100%;
    }
    50% {
      height: 95%;
    }
    100% {
      height: 100%;
    }
  }
`;

export type Object = "undefined" | "gem" | "mine";

export interface Tile {
  type: Object;
  squeeze: boolean;
}

export interface TileProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    Tile {
  inProgress: boolean;
}

export const Tiles: React.FC<TileProps> = ({
  inProgress,
  squeeze,
  type,
  ...props
}) => {
  const gem = new Howl({ src: [gem_audio] });
  const mine = new Howl({ src: [mine_audio] });

  React.useEffect(() => {
    if (squeeze) return;
    if (type === "gem") gem.play();
    if (type === "mine") mine.play();
  }, [squeeze, type]);

  return (
    <TileContainer
      inProgress={inProgress}
      revealed={type !== "undefined"}
      squeeze={squeeze}
      {...props}
    >
      {type === "gem" ? <Gem /> : type === "mine" ? <Mine /> : null}
    </TileContainer>
  );
};
