import useGame, { goTurn, parseCommand } from "./useGame";
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

// These tests aren't exhaustive, but they should cover the commands
// mentioned in the spec and most use cases.
let gameSetup: ReturnType<typeof useGame>;

describe("useGame suite", () => {
  // thanks to davidmfoley on the Reactiflux discord for helping me debug this.
  beforeEach(() => {
    gameSetup = useGameSetup();
  });
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
  describe("GameContext", () => {
    it("initializes correctly", () => {
      expect(gameSetup.state).toEqual({
        board: [
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
        ],
        robotX: undefined,
        robotY: undefined,
        robotFacing: "SOUTH",
        log: [],
      });
    });
    it("correctly places a robot", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 2,3,NORTH`);
      });
      expect(gameSetup.state.robotX).toBe(1);
      expect(gameSetup.state.robotY).toBe(2);
      expect(gameSetup.state.robotFacing).toBe("NORTH");
    });
    it("correctly faces a robot", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 2,3,NORTH`);
        gameSetup.processCommand(`SET_DIRECTION:SOUTH`);
      });
      expect(gameSetup.state.robotX).toBe(1);
      expect(gameSetup.state.robotY).toBe(2);
      expect(gameSetup.state.robotFacing).toBe("SOUTH");
    });
    it("correctly places, removes, and toggles walls", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_WALL 2,3`);
        gameSetup.processCommand(`PLACE_WALL 5,5`);
      });

      expect(gameSetup.state.board).toEqual([
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, false, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, false],
      ]);
      act(() => {
        gameSetup.processCommand(`CLEAR_WALL 2,3`);
      });
      expect(gameSetup.state.board).toEqual([
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, false],
      ]);
      act(() => {
        gameSetup.processCommand(`TOGGLE_WALL 1,1`);
        gameSetup.processCommand(`TOGGLE_WALL 5,5`);
      });
      expect(gameSetup.state.board).toEqual([
        [false, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ]);
      act(() => {
        gameSetup.processCommand(`CLEAR_BOARD`);
      });
      expect(gameSetup.state.board).toEqual([
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ]);
    });
    it("ignores an invalid facing direction", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 1,1,CENTER`);
      });
      // no changes
      expect(gameSetup.state.robotX).toBe(undefined);
      expect(gameSetup.state.robotY).toBe(undefined);
      expect(gameSetup.state.robotFacing).toBe("SOUTH");

      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 1,1,EAST`);
      });
      // valid input
      expect(gameSetup.state.robotX).toBe(0);
      expect(gameSetup.state.robotY).toBe(0);
      expect(gameSetup.state.robotFacing).toBe("EAST");
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 5,5,NORTH_BY_NORTHWEST`);
      });
      // no change from valid input
      expect(gameSetup.state.robotX).toBe(0);
      expect(gameSetup.state.robotY).toBe(0);
      expect(gameSetup.state.robotFacing).toBe("EAST");
    });
    it("ignores an invalid coordinate", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 2,6,EAST`);
      });
      // no changes
      expect(gameSetup.state.robotX).toBe(undefined);
      expect(gameSetup.state.robotY).toBe(undefined);
      expect(gameSetup.state.robotFacing).toBe("SOUTH");

      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 1,1,EAST`);
      });
      // valid input
      expect(gameSetup.state.robotX).toBe(0);
      expect(gameSetup.state.robotY).toBe(0);
      expect(gameSetup.state.robotFacing).toBe("EAST");
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 2,6,EAST`);
      });
      // no changes
      expect(gameSetup.state.robotX).toBe(0);
      expect(gameSetup.state.robotY).toBe(0);
      expect(gameSetup.state.robotFacing).toBe("EAST");
    });
    it("moves the robot", () => {
      act(() => {
        // robot starts at 1,1 facing North
        gameSetup.processCommand(`PLACE_ROBOT 1,1,NORTH`);
        gameSetup.processCommand(`MOVE`);
        gameSetup.processCommand(`REPORT`);
        gameSetup.processCommand(`PLACE_ROBOT 1,1,SOUTH`);
        gameSetup.processCommand(`MOVE`);
        gameSetup.processCommand(`REPORT`);
      });
      expect(gameSetup.state.log).toEqual([`1,2,NORTH`, `1,5,SOUTH`]);
    });
    it("rotates the robot", () => {
      act(() => {
        // robot starts at 1,1 facing North
        gameSetup.processCommand(`PLACE_ROBOT 1,1,NORTH`);
        gameSetup.processCommand(`LEFT`);
        gameSetup.processCommand(`REPORT`);
        gameSetup.processCommand(`RIGHT`);
        gameSetup.processCommand(`REPORT`);
      });
      expect(gameSetup.state.log).toEqual([`1,1,WEST`, `1,1,NORTH`]);
    });
    it("correctly handles complex game state", () => {
      act(() => {
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
        TEST_1.split("\n").forEach((line) => {
          gameSetup.processCommand(line);
        });
      });
      expect(gameSetup.state).toEqual({
        board: [
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, true, true, true],
          [true, true, false, true, true],
        ],
        robotFacing: "EAST",
        robotX: 0,
        robotY: 3,
        log: ["1,4,EAST"],
      });
      act(() => {
        gameSetup.processCommand("CLEAR_BOARD");
        gameSetup.processCommand("CLEAR_ROBOT");
        gameSetup.processCommand("CLEAR_REPORTS");

        const TEST_2 = `PLACE_ROBOT 2,2,WEST
          PLACE_WALL 1,1
          PLACE_WALL 2,2
          PLACE_WALL 1,3
          LEFT
          LEFT
          MOVE
          REPORT
        `;
        TEST_2.split("\n").forEach((line) => {
          gameSetup.processCommand(line);
        });
      });
      expect(gameSetup.state).toEqual({
        board: [
          [false, true, true, true, true],
          [true, true, true, true, true],
          [false, true, true, true, true],
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
