import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "@emotion/styled";

import { GameStateContext } from "../GameContext/GameProvider";

interface StyledRobotProps {
  animationFrame: number;
  direction?: string;
}

const SPRITESHEET_BASE_X = 150;
const SPRITESHEET_BASE_Y = 148;
const whichSprite = ({
  animationFrame,
  direction,
}: StyledRobotProps): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  if (direction === "NORTH") {
    y = 0; // useless reassignment, but this code helps make it more human parsable for changes later. 
  }
  if (direction === "SOUTH") {
    y = 47;
  }
  if (direction === "WEST") {
    y = 96;
  }
  if (direction === "EAST") {
    y = 144
  }
  if (animationFrame % 2 === 0) { // on 2 and 4
    x = 50;
  }
  if (animationFrame % 4 === 1) { // on 1
    x = 0;
  }
  if (animationFrame % 4 === 3) { // on 3
    x = 100;
  }
  return { x: x + SPRITESHEET_BASE_X, y: y + SPRITESHEET_BASE_Y };
};

const StyledRobot = styled.div<StyledRobotProps>`
  position: absolute;
  left: 15px;
  top: 7px;
  width: 33px;
  height: 45px;
  z-index: 1000;
  background: ${(props) => {
    const { x, y } = whichSprite(props);
    return `url(${process.env.PUBLIC_URL}/sprites/robot-sprite-sheet.jpg) -${x}px -${y}px`;
  }};
`;

// We don't want to re-render when the state changes
// only when the robot changes direction.
const useMemoizedRobotContext = () => {
  const state = useContext(GameStateContext);
  const { robotFacing } = state;
  return useMemo(
    () => ({
      robotFacing,
    }),
    [robotFacing]
  );
};
export const Robot = () => {
  const { robotFacing } = useMemoizedRobotContext();
  const [animationFrame, setAnimationFrame] = useState<number>(0);

  const tick = useCallback(() => {
    let tickInterval = setInterval(
      () => setAnimationFrame((time) => (time + 1) % 4),
      250
    );
    return () => clearInterval(tickInterval);
  }, [setAnimationFrame]);

  useEffect(() => {
    let tickTimeout = tick();
    return tickTimeout;
  }, [tick]);

  if (typeof robotFacing !== "undefined") {
    return (
      <StyledRobot animationFrame={animationFrame} direction={robotFacing} />
    );
  }
  return null;
};

export default Robot;
