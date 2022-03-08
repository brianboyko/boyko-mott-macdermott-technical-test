import { useCallback } from "react";
import { useImmerReducer } from "use-immer";
/* Immer is built into reduxjs/toolkit, but as this is a small app, 
   it doesn't really need redux. It *does* need Immer, though.
   
   One of the tricks with React is that if you alter a property
   on an object, it won't register the change and re-render. 

   While JS "doesn't use pointers", what's really happening is that
   React is listening for a change in the pointer, not a deep listen.
   Using an immutability library means that altering a property creates
   a new immutable object which WILL register as a change. 
*/

export type BoardRow = [boolean, boolean, boolean, boolean, boolean];
export type Board = [BoardRow, BoardRow, BoardRow, BoardRow, BoardRow];

export interface ReducerAction {
  type: string;
  x?: number;
  y?: number;
  facing?: string;
}

export interface GameState {
  board: Board;
  robotX?: number;
  robotY?: number;
  robotFacing?: string;
  log: string[];
}

// This could be an enum, or we could refer to it as
// type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST" | undefined
// but that's a level of TS specificity that a code challenge doesn't
// really need.
const DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"];

export const goTurn = (
  turn: string,
  currDirection?: string
): string | undefined => {
  if (typeof currDirection === "undefined") {
    return undefined;
  }
  const nowIndex = DIRECTIONS.indexOf(currDirection);
  if (nowIndex === -1) {
    return undefined;
  }
  if (turn === "LEFT") {
    if (nowIndex === 0) {
      return DIRECTIONS[3];
    } else {
      return DIRECTIONS[nowIndex - 1];
    }
  }
  if (turn === "RIGHT") {
    return DIRECTIONS[(nowIndex + 1) % 4];
  }
  return currDirection;
};

// Kludgy but servicable - converts a number or a "number as string" to a number,
// then adds or subtracts a value from it. Useful for turning 0-indexed arrays
// into 1-index grids.
const convertOffByOne = (n?: string, adder = -1): number | undefined => {
  if (n === undefined) {
    return undefined;
  }
  return parseInt(n, 10) + adder;
};

// isn't it cool how the commands in the spec always have
// the same values in the same place?

export const parseCommand = (command: string): ReducerAction => {
  const [type, xStr, yStr, facing]: Array<string | undefined> = command
    .split(/[\s,]+/)
    .map((str) => str.trim())
    .filter((elem) => !!elem); // destructuring ftw;
  const x: number | undefined = convertOffByOne(xStr);
  const y: number | undefined = convertOffByOne(yStr);
  return { type, x, y, facing };
};

export const initBoard = (): Board =>
  Array(5).fill(Array(5).fill(true)) as Board;

export const isValidPlacement = (
  board: Board,
  x?: number,
  y?: number,
  facing?: string
): boolean => {
  // if we've defined facing but NOT correctly
  if (facing !== undefined && !DIRECTIONS.includes(facing)) {
    return false;
  }
  // if we've not correctly defined the position
  if (typeof x === "undefined" || typeof y === "undefined") {
    return false;
  }
  // if it's not on the board.
  if (x > -1 && x < 5 && y > -1 && y < 5) {
    // return the current cell state
    return board[x][y];
  }
  return false;
};

const isValidReportData = (state: GameState): boolean => {
  return (
    typeof state.robotX === "number" &&
    typeof state.robotY === "number" &&
    typeof state.robotFacing === "string" &&
    DIRECTIONS.includes(state.robotFacing)
  );
};

/* using immer means that we can just mutate the state
    and it will diff automatically. Some programmers
    prefer using the parameter name "draft", as in
    const gameImmerReducer = (draft, action) => {}; */
const gameImmerReducer = (
  state: GameState,
  { type, x, y, facing }: ReducerAction
) => {
  // if statements just as performant as switch statements in JS
  // and we don't have to worry about fallthrough.
  if (type === "REPORT" && isValidReportData(state)) {
    state.log.push(
      `${(state.robotX as number) + 1},${(state.robotY as number) + 1},${
        state.robotFacing
      }`
    );
  }
  if (type === "CLEAR_REPORTS") {
    state.log = [];
  }
  if (type === "CLEAR_BOARD") {
    state.board = initBoard();
  }
  if (type === "PLACE_ROBOT" && isValidPlacement(state.board, x, y, facing)) {
    state.robotX = x;
    state.robotY = y;
    state.robotFacing = facing;
  }
  if (type === "CLEAR_ROBOT") {
    state.robotX = undefined;
    state.robotY = undefined;
    state.robotFacing = undefined;
  }
  if (
    type === "PLACE_WALL" &&
    isValidPlacement(state.board, x, y) &&
    !(x === state.robotX && y === state.robotY)
  ) {
    state.board[x as number][y as number] = false;
  }
  if (type === "CLEAR_WALL") {
    if (isValidPlacement(state.board, x, y)) {
      state.board[x as number][y as number] = true;
    }
  }
  if (
    type === "TOGGLE_WALL" &&
    isValidPlacement(state.board, x, y) &&
    !(x === state.robotX && y === state.robotY)
  ) {
    if (isValidPlacement(state.board, x, y)) {
      state.board[x as number][y as number] = !state.board[x as number][y as number]
    }
  }
  if (type === "LEFT" || type === "RIGHT") {
    const newDirection = goTurn(type, state.robotFacing);
    state.robotFacing = newDirection || state.robotFacing;
  }
  if (type === "MOVE") {
    if (
      typeof state.robotX === "undefined" ||
      typeof state.robotY === "undefined"
    ) {
      return;
    }
    // sometimes mutable variables are just easier.
    let newX = state.robotX;
    let newY = state.robotY;
    if (state.robotFacing === "NORTH") {
      newY = (state.robotY + 1) % 5;
    }
    if (state.robotFacing === "SOUTH") {
      newY = state.robotY === 0 ? 4 : state.robotY - 1;
    }
    if (state.robotFacing === "EAST") {
      newX = (state.robotX + 1) % 5;
    }
    if (state.robotFacing === "WEST") {
      newX = state.robotX === 0 ? 4 : state.robotX - 1;
    }
    if (isValidPlacement(state.board, newX, newY)) {
      state.robotX = newX;
      state.robotY = newY;
    } else {
      console.warn(`Invalid placement, {${state.robotX},${state.robotY}}`);
    }
  }
};

export const useGame = () => {
  const [state, dispatch] = useImmerReducer(gameImmerReducer, {
    board: initBoard(),
    robotX: undefined,
    robotY: undefined,
    robotFacing: undefined,
    log: [],
  });

  const logToConsole = useCallback(() => {
    console.log(state);
  }, [state]);

  const processCommand = useCallback(
    (command: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log("command", command);
        if (command === "DEBUG") {
          logToConsole();
          return;
        }
      }
      dispatch(parseCommand(command));
    },
    [dispatch, logToConsole]
  );

  const checkValidReport = useCallback(() => isValidReportData(state), [state]);

  // mostly used to determine if buttons should be disabled;
  const checkPlacement = useCallback(
    (x?: number, y?: number, facing?: string) =>
      isValidPlacement(state.board, x, y, facing),
    [state.board]
  );

  return { state, processCommand, checkPlacement, checkValidReport };
};

export default useGame;
