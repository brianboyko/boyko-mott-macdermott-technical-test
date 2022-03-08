import React, { useContext } from "react";
import styled from "styled-components";
import { GameStateContext } from "../GameContext/GameProvider";
import Robot from "./Robot";

const StyledCell = styled.div<{ isRobot: boolean; live: boolean }>`
  position: relative;
  width: 60px;
  height: 60px;
  border: ${(props) =>
    props.isRobot ? `1px solid gold` : `1px solid #888888`};
  color: ${(props) => (props.live ? "black" : "white")};
  background: ${(props) =>
    props.live ? "rgba(255,255,247,1)" : "rgba(2,0,36,1)"};
  background: ${(props) =>
    props.live
      ? "radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(255,255,247,1) 0%, rgba(198,198,192,1) 92%, rgba(9,9,9,1) 100%)"
      : "radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(255,255,247,1) 0%, rgba(9,9,9,1) 0%, rgba(30,30,30,1) 86%, rgba(255,255,255,1) 100%)"};
`;

export const Board = () => {
  const state = useContext(GameStateContext);
  const isRobot = (cellIndex: number, rowIndex: number): boolean =>
    state.robotX === cellIndex && state.robotY === rowIndex;
  // I don't like how this is structured. Refactor target for code readability?
  return (
    <div>
      {state.board
        .map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} style={{ display: "flex" }}>
            {row.map((cell, cellIndex) => (
              <StyledCell
                isRobot={isRobot(cellIndex, rowIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}
                live={cell}
              >
                {`{${cellIndex},${rowIndex}}`}
                {isRobot(cellIndex, rowIndex) ? <Robot /> : null}
              </StyledCell>
            ))}
          </div>
        ))
        .reverse()}
    </div>
  );
};

export default Board;
