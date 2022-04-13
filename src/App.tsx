import * as React from "react";
import Instructions from "./Intructions";
import Game from "./Game";
import { initialTiles, useAPI } from "./helpers/index";
import "./styles.css";

export default function App() {
  const [tiles, setTiles] = React.useState(initialTiles);
  const [inProgress, setInProgress] = React.useState(false);
  const { bet, reveal, cashoutAvailable, cashout } = useAPI({
    tiles,
    setTiles,
    inProgress,
    setInProgress
  });

  return (
    <>
      <Instructions />
      <Game
        tiles={tiles}
        inProgress={inProgress}
        onBet={() => bet.run()}
        onClickTile={(_, position) => reveal.run(position)}
        cashoutAvailable={cashoutAvailable}
        onCashout={() => cashout.run()}
      />
    </>
  );
}
