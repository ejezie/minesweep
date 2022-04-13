// following API - this is how to not write an API
import _ from "lodash";

type State = "idle" | "progress" | "cashout" | "busted";

// Type annotation
export type CasinoGameMines = {
  minesCount: number;
  mines: number[];
  revealedTiles: number[];
  state: State;
};

export const wait = () =>
  new Promise<void>((resolve) =>
    setTimeout(resolve, Math.random() * 500 + 200)
  );

let gameState: CasinoGameMines = {
  minesCount: 5,
  mines: [],
  revealedTiles: [],
  state: "idle"
};

const minesFields = _.range(0, 49);

//  Game new round initialisation
export const minesBet = async () => {
  await wait();

  // shufle mines
  const newRoundTiles = _.shuffle(minesFields);
  // setting number of mines available, 9
  gameState.mines = newRoundTiles.slice(0, 9);
  gameState.revealedTiles = [];

  return getGameState("progress");
};

// Reveal Tiles
export const minesNext = async (tileToReveal: number) => {
  await wait();

  gameState.revealedTiles.push(tileToReveal);

  // check if tile parameter is contained in mines list
  if (gameState.mines.includes(tileToReveal)) {
    return getGameState("busted");
  }
  // else game continues
  return getGameState("progress");
};

const getGameState = (state: State) => {
  gameState.state = state;

  if (state === "progress") {
    return { ...gameState, mines: [] };
  }

  return gameState;
};

// Set cashout state
export const minesCashout = async () => {
  await wait();

  return getGameState("cashout");
};
