import useGame, { goTurn, initBoard, parseCommand } from "./useGame";
import { render, act } from "@testing-library/react";

// trick learned from : https://kentcdodds.com/blog/how-to-test-custom-react-hooks
const useGameSetup = () => {
  const returnVal: any = {};
  const TestComponent = () => {
    Object.assign(returnVal, useGame());
    return null;
  };
  render(<TestComponent />);
  return returnVal;
};

const TEST_1 = `
PLACE_ROBOT 3,3,NORTH
PLACE_WALL 3,5
MOVE
MOVE
RIGHT
MOVE
MOVE
MOVE
REPORT
`;
const TEST_2 = `
PLACE_ROBOT 2,2,WEST
PLACE_WALL 1,1
PLACE_WALL 2,2
PLACE_WALL 1,3
LEFT
LEFT
MOVE
REPORT`;

describe("useGame suite", () => {
  describe("goTurn()", () => {
    it("correctly turns", () => {
      expect(goTurn("RIGHT", "NORTH")).toBe("EAST");
      expect(goTurn("RIGHT", "EAST")).toBe("SOUTH");
      expect(goTurn("RIGHT", "SOUTH")).toBe("WEST");
      expect(goTurn("RIGHT", "WEST")).toBe("NORTH");
      expect(goTurn("LEFT", "NORTH")).toBe("WEST");
      expect(goTurn("LEFT", "EAST")).toBe("NORTH");
      expect(goTurn("LEFT", "SOUTH")).toBe("EAST");
      expect(goTurn("LEFT", "WEST")).toBe("SOUTH");
    });
    it("handles bogus input", () => {
      expect(goTurn("RIGHT")).toBeUndefined();
      expect(goTurn("RIGHT", "TRANSYLVANIA")).toBeUndefined();
      expect(goTurn("STRAIGHT_TO_HELL", "SOUTH")).toBe("SOUTH");
      expect(goTurn("ON A CRAZY TRAIN")).toBeUndefined();
    });
  });
  describe("parseCommands()", () => {
    it("parses commands into ReducerActions", () => {
      expect(parseCommand("REPORT")).toEqual({ type: "REPORT" });
      expect(parseCommand("RANDOM_JUNK")).toEqual({ type: "RANDOM_JUNK" });
      expect(parseCommand("CLEAR_REPORTS")).toEqual({ type: "CLEAR_REPORTS" });
      expect(parseCommand("CLEAR_BOARD")).toEqual({ type: "CLEAR_BOARD" });
      expect(parseCommand("PLACE_ROBOT 3,2 NORTH")).toEqual({
        type: "PLACE_ROBOT",
        x: 2,
        y: 1,
        facing: "NORTH",
      });
      expect(parseCommand("PLACE_WALL 3,2")).toEqual({
        type: "PLACE_WALL",
        x: 2,
        y: 1,
      });
      expect(parseCommand("CLEAR_WALL 3,2")).toEqual({
        type: "CLEAR_WALL",
        x: 2,
        y: 1,
      });
      expect(parseCommand("LEFT")).toEqual({ type: "LEFT" });
      expect(parseCommand("RIGHT")).toEqual({ type: "RIGHT" });
      expect(parseCommand("MOVE")).toEqual({ type: "MOVE" });
    });
  });
  describe("useGame() custom hook", () => {
    it("correctly handles game state", () => {
      const gameSetup = useGameSetup();
      expect(gameSetup.state).toEqual({
        board: initBoard(),
        robotX: undefined,
        robotY: undefined,
        robotFacing: undefined,
        log: [],
      });
      act(() => {
        TEST_1.split("\n").forEach((line) => {
          gameSetup.processCommand(line);
        });
      });
      expect(gameSetup.state).toEqual({
        board: initBoard(),
        robotFacing: "EAST",
        robotX: 0,
        robotY: 4,
        log: ["1,5,EAST"],
      });
      act(() => {
        gameSetup.processCommand("CLEAR_BOARD");
        gameSetup.processCommand("CLEAR_ROBOT");
        gameSetup.processCommand("CLEAR_REPORTS");

        TEST_2.split("\n").forEach((line) => {
          gameSetup.processCommand(line);
        });
      });
      expect(gameSetup.state).toEqual({
        board: [
          [false, true, false, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
        ],
        robotFacing: "EAST",
        robotX: 2,
        robotY: 1,
        log: ["3,2,EAST"],
      });
    });
  });
});
