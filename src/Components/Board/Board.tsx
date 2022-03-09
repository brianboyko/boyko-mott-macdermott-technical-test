import React, { useCallback, useContext, useState } from "react";
import { DIRECTIONS } from "../../GameContext/useGame";
import { MdNorth, MdSouth, MdWest, MdEast } from "react-icons/md";
import {
  GameDispatchContext,
  GameStateContext,
} from "../../GameContext/GameProvider";
import Robot from "../Robot";
import { PlaceRobotButton } from "../ui/Buttons";
import {
  StyledBoardContainer,
  StyledRow,
  StyledCell,
  StyledInstructions,
  StyledPlaceAndDirection,
  StyledDirectionGrid,
  StyledDirectionalHeader,
  StyledDirectionButton,
} from "./Board.styled";

export const Board = () => {
  const state = useContext(GameStateContext);
  const { processCommand, checkPlacement } = useContext(GameDispatchContext);
  const isRobot = (cellIndex: number, rowIndex: number): boolean =>
    state.robotX === cellIndex && state.robotY === rowIndex;
  const [isRobotPlacement, setIsRobotPlacement] = useState<boolean>(false);

  const handlePlaceRobotClick = useCallback(() => {
    setIsRobotPlacement((curr) => !curr);
  }, []);

  const handleDirectionalClick = useCallback(
    (direction: string) => () => {
      processCommand(`SET_DIRECTION:${direction}`);
    },
    [processCommand]
  );

  const handleCellClick = useCallback(
    (x: number, y: number, isLive: boolean) => () => {
      console.log({ x, y });
      if (isRobotPlacement) {
        if (
          checkPlacement(x, y) &&
          isLive &&
          DIRECTIONS.includes(state.robotFacing as string)
        ) {
          processCommand(`PLACE_ROBOT ${x + 1},${y + 1},${state.robotFacing}`);
          setIsRobotPlacement(false);
        } else {
          console.warn(
            `Invalid Robot placement at ${x + 1},${y + 1},${state.robotFacing}`
          );
        }
      } else {
        processCommand(`TOGGLE_WALL, ${x + 1},${y + 1}`);
      }
    },
    [checkPlacement, isRobotPlacement, processCommand, state.robotFacing]
  );

  return (
    <>
      <StyledBoardContainer>
        {state.board
          .map((row, yIndex) => (
            <StyledRow key={`row-${yIndex}`} style={{ display: "flex" }}>
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
            </StyledRow>
          ))
          .reverse()}
      </StyledBoardContainer>
      <StyledInstructions>
        Click on grid to place and remove walls
      </StyledInstructions>
      <StyledPlaceAndDirection>
        <StyledDirectionGrid>
          <StyledDirectionalHeader>Set Direction</StyledDirectionalHeader>
          <StyledDirectionButton
            onClick={handleDirectionalClick("NORTH")}
            aria-label="North Button"
            value="NORTH"
            colorScheme={state.robotFacing === "NORTH" ? "green" : "blue"}
            icon={<MdNorth />}
          />
          <StyledDirectionButton
            onClick={handleDirectionalClick("WEST")}
            aria-label="West Button"
            value="WEST"
            colorScheme={state.robotFacing === "WEST" ? "green" : "blue"}
            icon={<MdWest />}
          />
          <StyledDirectionButton
            onClick={handleDirectionalClick("EAST")}
            aria-label="East Button"
            value="EAST"
            colorScheme={state.robotFacing === "EAST" ? "green" : "blue"}
            icon={<MdEast />}
          />
          <StyledDirectionButton
            onClick={handleDirectionalClick("SOUTH")}
            aria-label="South Button"
            value="SOUTH"
            colorScheme={state.robotFacing === "SOUTH" ? "green" : "blue"}
            icon={<MdSouth />}
          />
        </StyledDirectionGrid>
        <PlaceRobotButton
          onClick={handlePlaceRobotClick}
          colorScheme={isRobotPlacement ? "red" : "blue"}
          textLabel={
            isRobotPlacement ? "Cancel Robot Placement" : "Place Robot"
          }
        />
      </StyledPlaceAndDirection>
    </>
  );
};

export default Board;
