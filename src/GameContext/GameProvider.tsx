import React, { createContext, ReactNode, useCallback } from "react";
import useGame, { GameState, initBoard } from "./useGame";
// The main purposes of wrapping our useGame hook into a context is so that we have a singleton we can import
// into all our components. We could just useGame() in the app directory and pass it down as props, but that would
// require a little prop drilling.

export const GameStateContext = createContext<GameState>({
  board: initBoard(),
  robotX: undefined,
  robotY: undefined,
  robotFacing: undefined,
  log: []
});

export const GameDispatchContext = createContext({
  processCommand: (_command: string) => {},
});

const GameProvider = ({ children }: {children: ReactNode}) => {
  const logAsWarn = useCallback((info) => {
    console.warn(info);
  }, []); 
  const { state, processCommand } = useGame(logAsWarn);
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={{ processCommand }}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

export default GameProvider;
