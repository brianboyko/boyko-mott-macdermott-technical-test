import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import { GameStateContext } from "../GameContext/GameProvider";

interface StyledRobotProps {
  animationFrame: number;
  direction?: string;
}
const whichFrame = ({
  animationFrame,
  direction,
}: StyledRobotProps): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  if (direction === "NORTH") {
    y = 148;
  }
  if (direction === "SOUTH") {
    y = 195;
  }
  if (direction === "WEST") {
    y = 244;
  }
  if (direction === "EAST") {
    y = 292;
  }
  if (animationFrame % 2 === 0) {
    x = 50;
  }
  if (animationFrame % 4 === 1) {
    x = 0;
  }
  if (animationFrame % 4 === 3) {
    x = 100;
  }
  return { x: x + 150, y };
};

const StyledRobot = styled.div<StyledRobotProps>`
  position: absolute;
  left: 15px;
  top: 7px;
  width: 33px;
  height: 45px;
  z-index: 1000;
  background: ${(props) => {
    const { x, y } = whichFrame(props);
    return `url(${process.env.PUBLIC_URL}/sprites/robot-sprite-sheet.jpg) -${x}px -${y}px`;
  }};
`;

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
      () => setAnimationFrame((time) => (time + 1) % 16),
      500
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
