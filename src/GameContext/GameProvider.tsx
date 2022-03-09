import React, { createContext, ReactNode } from "react";
import useGame, { GameState, initBoard } from "./useGame";
// The main purposes of wrapping our useGame hook into a context is so that we have a singleton we can import
// into all our components. We could just useGame() in the app directory and pass it down as props, but that would
// require a little prop drilling.

export const GameStateContext = createContext<GameState>({
  board: initBoard(),
  robotX: undefined,
  robotY: undefined,
  robotFacing: undefined,
  log: [],
});

interface GameDispatchContextType {
  processCommand: (command: string) => void;
  checkPlacement: (x?: number, y?: number, facing?: string) => boolean;
  checkValidReport: () => boolean;
}
export const GameDispatchContext = createContext<GameDispatchContextType>({
  processCommand: (_command: string) => {},
  checkPlacement: (_x?: number, _y?: number, _facing?: string) => false,
  checkValidReport: () => false,
});

const GameProvider = ({ children }: { children: ReactNode }) => {
  const { state, processCommand, checkPlacement, checkValidReport } = useGame();
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider
        value={{ processCommand, checkPlacement, checkValidReport }}
      >
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export default GameProvider;
