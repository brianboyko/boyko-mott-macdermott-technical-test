import { useImmerReducer } from "use-immer";
/* Immer is built into redux, but as this is a small app, it doesn't really need it.
   Mostly this is so that we correctly render changes to the board matrix - that 
   react notices this is a change, without having tons of 'spread parties' or 
   (god forbid) JSON.parse(JSON.stringify(state)); 
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
}

const DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"];

const goTurn = (turn: string, currDirection: string): string | undefined => {
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
};

// isn't it cool how the commands in the spec always have
// the same values in the same place?
const convertOffByOne = (n?: string): number | undefined => {
  if (n === undefined) {
    return undefined;
  }
  return parseInt(n, 10) - 1;
};
export const parseCommand = (command: string): ReducerAction => {
  const [type, xStr, yStr, facing]: Array<string | undefined> =
    command.split(/[\s,]+/);
  const x: number | undefined = convertOffByOne(xStr);
  const y: number | undefined = convertOffByOne(yStr);
  return { type, x, y, facing };
};

const initBoard = (): Board => Array(5).fill(Array(5).fill(true)) as Board;

const isValidPlacement = (board: Board, x: number, y: number) => {
  if (x > 0 && x < 5 && y > 0 && y < 5) {
    return board[x][y];
  }
};

const gameImmerReducer = (
  state: GameState,
  { type, x, y, facing }: ReducerAction
) => {
  if (type === "CLEAR_BOARD") {
    state.board = initBoard();
  }
  if (type === "PLACE_ROBOT") {
    if (isValidPlacement(state.board, x, y)) {
      state.robotX = x;
      state.robotY = y;
      state.robotFacing = facing;
    }
  }
  if (type === "PLACE_WALL") {
    if (x > 0 && x < 5 && y > 0 && y < 5) {
      state.board[x][y] = false;
    }
  }
  if (type === "LEFT" || type === "RIGHT") {
    const newDirection = goTurn(type, state.robotFacing);
    state.robotFacing = newDirection || state.robotFacing;
  }
  if (type === "MOVE") {
    // sometimes mutable variables are just easier.
    let newX = state.robotX;
    let newY = state.robotY;
    if (state.robotFacing === "NORTH") {
      newY = (state.robotY + 1) % 5;
    }
    if (state.robotFacing === "SOUTH") {
      newY = state.robotY === 0 ? 4 : state.robotY - 1;
    }
    if (state.robotFacing === "WEST") {
      newX = (state.robotX + 1) % 5;
    }
    if (state.robotFacing === "EAST") {
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
  });

  const processCommand = (command: string) => {
    if (command === "REPORT") {
      console.log(
        `${state.robotX + 1},${state.robotY + 1},${state.robotFacing}`
      );
    } else {
      dispatch(parseCommand(command));
    }
  };
  return { state, processCommand };
};

export default useGame;