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

// These tests aren't exhaustive, but they should cover most
// use cases

/* Current test status:

       ✓ initializes correctly (3 ms)
      ✕ correctly places a robot (28 ms)
      ✕ correctly places, removes, and toggles walls (3 ms)
      ✕ ignores an invalid facing direction
      ✕ ignores an invalid coordinate (1 ms)
      ✕ moves the robot (1 ms)
      ✕ rotates the robot
      ✕ correctly handles complex game state (1 ms)
      */

describe("useGame suite", () => {
  describe("useGame", () => {
    const gameSetup = useGameSetup();
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
        robotFacing: undefined,
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
    it("correctly places, removes, and toggles walls", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_WALL 2,3`);
        gameSetup.processCommand(`PLACE_WALL 5,5`);
      });
      expect(gameSetup.state.board).toEqual([
        [true, true, true, true, true],
        [true, true, false, true, true],
        [true, true, true, true, true],
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
      expect(gameSetup.state.robotX).toBe(1);
      expect(gameSetup.state.robotY).toBe(2);
      expect(gameSetup.state.robotFacing).toBe("NORTH");
    });
    it("ignores an invalid coordinate", () => {
      act(() => {
        gameSetup.processCommand(`PLACE_ROBOT 2,6,EAST`);
      });
      // no changes
      expect(gameSetup.state.robotX).toBe(1);
      expect(gameSetup.state.robotY).toBe(2);
      expect(gameSetup.state.robotFacing).toBe("NORTH");
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
          [true, true, true, true, false],
          [true, true, true, true, true],
          [true, true, true, true, true],
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
