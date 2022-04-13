import * as React from "react";
import * as api from "../api";
import { Tile } from "../components/Tile";
import useFetch from "./useFetch";

// set types, type annotation
type Grid = { tile: number };
type Mines = { mines: Array<number> };
type Progress = { status: "progress" };
// combining types
type Reveal = Progress & Grid;
type Busted = { status: "busted" } & Grid & Mines;
type Cashout = { status: "cashout" } & Mines;

// Function creates the tiles
export const initialTiles = () => {
  // Creating tiles, 49 created
  const createTiles: Array<Tile> = new Array(49);

  // Assigning type and squeeze state, used to track tile state
  for (var i = 0; i < createTiles.length; i++) {
    createTiles[i] = {
      type: "undefined",
      squeeze: false
    };
  }

  return createTiles;
};

// Function check tiles array, returns found tile that is not undefined (revealed)
const isRevealed = (tiles: Array<Tile>) => {
  return tiles.some((tile) => tile.type !== "undefined");
};

// Reveal the remaining mines and gems on cashout and busted state
// Map through tiles array, if not undefined set as tile
// Compare mine index to array tiles index, if it is included set mine
const revealRemaining = (tiles: Array<Tile>, mines: Array<number>) => {
  return tiles.map(
    (tile, index): Tile =>
      tile.type !== "undefined"
        ? tile
        : { type: mines.includes(index + 1) ? "mine" : "gem", squeeze: true }
  );
};

// Function handles bet button click
export function useBetButton(
  setTiles: React.Dispatch<React.SetStateAction<Array<Tile>>>,
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>
) {
  async function clickBetButton(): Promise<Progress> {
    // get state from api
    const { state } = await api.minesBet();

    // return state if it is progress
    if (state === "progress") {
      return { status: "progress" };
    } else {
      throw new Error("The game is not started.");
    }
  }

  const bet = useFetch(clickBetButton);

  React.useEffect(() => {
    if (!bet.response) return;

    if (bet.response.status === "progress") {
      setTiles(initialTiles);
      setInProgress(true);
    }
  }, [bet.response, setTiles, setInProgress]);

  return bet;
}

// Function handles tile revealing on click
export function useRevealTile(
  setTiles: React.Dispatch<React.SetStateAction<Array<Tile>>>,
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>
) {
  async function clickTile(tile: number): Promise<Reveal | Busted> {
    const { state, mines } = await api.minesNext(tile);

    if (state === "progress") return { status: "progress", tile };
    if (state === "busted") return { status: "busted", mines, tile };
    throw new Error("The game state is not in progress or busted");
  }

  const reveal = useFetch(clickTile);

  React.useEffect(() => {
    if (!reveal.response) return;

    if (reveal.response.status === "progress") {
      setTiles((tiles) => {
        if (!reveal.response) return tiles;

        const newTiles = tiles.concat();
        newTiles[reveal.response.tile - 1].type = "gem";

        return newTiles;
      });
    } else if (reveal.response.status === "busted") {
      setTiles((tiles) => {
        if (!reveal.response || reveal.response.status !== "busted")
          return tiles;

        const newTiles = revealRemaining(tiles, reveal.response.mines);
        newTiles[reveal.response.tile - 1].squeeze = false;

        return newTiles;
      });
      setInProgress(false);
    }
  }, [reveal.response, setTiles, setInProgress]);

  return reveal;
}

// Function handles cash out button click
export function useCashoutButton(
  setTiles: React.Dispatch<React.SetStateAction<Array<Tile>>>,
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>
) {
  async function clickCashoutButton(): Promise<Cashout> {
    const { state, mines } = await api.minesCashout();

    if (state === "cashout") return { status: "cashout", mines: mines };
    throw new Error("Cashout is not available");
  }

  const cashout = useFetch(clickCashoutButton);

  React.useEffect(() => {
    if (!cashout.response) return;

    const { mines } = cashout.response;
    if (cashout.response.status === "cashout") {
      setTiles((tiles) => revealRemaining(tiles, mines));
      setInProgress(false);
    }
  }, [cashout.response, setTiles, setInProgress]);
  return cashout;
}

// export api and use in components
export function useAPI({
  tiles,
  setTiles,
  inProgress,
  setInProgress
}: {
  tiles: Array<Tile>;
  setTiles: React.Dispatch<React.SetStateAction<Array<Tile>>>;
  inProgress: boolean;
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const bet = useBetButton(setTiles, setInProgress);
  const reveal = useRevealTile(setTiles, setInProgress);
  const cashout = useCashoutButton(setTiles, setInProgress);
  const cashoutAvailable = React.useMemo(
    () => inProgress && isRevealed(tiles),
    [tiles, inProgress]
  );

  return { bet, reveal, cashout, cashoutAvailable };
}
