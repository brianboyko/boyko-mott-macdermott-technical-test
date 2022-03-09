import React, { useCallback, useContext, useState } from "react";
import styled from "@emotion/styled";
import { Radio, RadioGroup } from "@chakra-ui/react";

import {
  GameDispatchContext,
  GameStateContext,
} from "../GameContext/GameProvider";
import Robot from "./Robot";
import { PlaceRobotButton } from "./ui/Buttons";

const StyledCell = styled.div<{
  isRobot: boolean;
  live: boolean;
  isRobotPlacement: boolean;
}>`
  position: relative;
  width: 60px;
  height: 60px;
  border: ${(props) =>
    props.isRobot ? `1px solid black` : `1px solid #888888`};
  color: ${(props) => (props.live ? "black" : "white")};
  background: ${(props) =>
    props.live ? "rgba(255,255,247,1)" : "rgba(2,0,36,1)"};
  background: ${(props) => {
    if (props.isRobot && props.live) {
      return "white";
    }
    return props.live
      ? "radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(255,255,247,1) 0%, rgba(198,198,192,1) 92%, rgba(9,9,9,1) 100%)"
      : "radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(255,255,247,1) 0%, rgba(9,9,9,1) 0%, rgba(30,30,30,1) 86%, rgba(255,255,255,1) 100%)";
  }};
  cursor: ${(props) => {
    if (props.isRobotPlacement && !props.live) {
      return props.live ? "grab" : "not-allowed";
    }
    return "cell";
  }};
`;

export const Board = () => {
  const state = useContext(GameStateContext);
  const { processCommand, checkPlacement } = useContext(GameDispatchContext);
  const isRobot = (cellIndex: number, rowIndex: number): boolean =>
    state.robotX === cellIndex && state.robotY === rowIndex;
  const [isRobotPlacement, setIsRobotPlacement] = useState<boolean>(false);
  const [robotInitialDirection, setRobotInitialDirection] =
    useState<string>("SOUTH");

  const handlePlaceRobotClick = useCallback(() => {
    setIsRobotPlacement((curr) => !curr);
  }, []);
  const handleCellClick = useCallback(
    (x: number, y: number, isLive: boolean) => () => {
      console.log({ x, y });
      if (isRobotPlacement) {
        if (checkPlacement(x, y) && isLive) {
          processCommand(
            `PLACE_ROBOT ${x + 1},${y + 1},${robotInitialDirection}`
          );
          setIsRobotPlacement(false);
        } else {
          console.warn(
            `Invalid Robot placement at ${x + 1},${
              y + 1
            },${robotInitialDirection}`
          );
        }
      } else {
        processCommand(`TOGGLE_WALL, ${x + 1},${y + 1}`);
      }
    },
    [checkPlacement, isRobotPlacement, processCommand, robotInitialDirection]
  );

  // I don't like how this is structured. Refactor target for code readability?

  return (
    <>
      <div>
        {state.board
          .map((row, yIndex) => (
            <div key={`row-${yIndex}`} style={{ display: "flex" }}>
              {row.map((cell, xIndex) => (
                <StyledCell
                  isRobotPlacement={isRobotPlacement}
                  isRobot={isRobot(xIndex, yIndex)}
                  key={`cell-${yIndex}-${xIndex}`}
                  live={cell}
                  onClick={handleCellClick(xIndex, yIndex, cell)}
                >
                  {`{${xIndex + 1},${yIndex + 1}}`}
                  {isRobot(xIndex, yIndex) ? <Robot /> : null}
                </StyledCell>
              ))}
            </div>
          ))
          .reverse()}
      </div>
      <div>
        <div>
          <RadioGroup
            onChange={setRobotInitialDirection}
            value={robotInitialDirection}
          >
            <Radio value="NORTH">North</Radio>
            <Radio value="WEST">West</Radio>
            <Radio value="EAST">East</Radio>
            <Radio value="SOUTH">South</Radio>
          </RadioGroup>
        </div>
        <PlaceRobotButton
          onClick={handlePlaceRobotClick}
          colorScheme={isRobotPlacement ? "red" : "blue"}
          textLabel={
            isRobotPlacement ? "Cancel Robot Placement" : "Place Robot"
          }
        />
      </div>
    </>
  );
};

export default Board;
