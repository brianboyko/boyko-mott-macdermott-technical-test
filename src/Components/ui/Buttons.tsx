import { useCallback, useContext, useMemo } from "react";
import Button from "react-bootstrap/Button";
import { GameDispatchContext } from "../../GameContext/GameProvider";
import {
  GrRobot,
  GrRotateLeft,
  GrRotateRight,
  GrRun,
  GrAnnounce,
  GrStatusPlaceholder,
} from "react-icons/gr";
import type { IconType } from "react-icons";

interface GenericButtonProps {
  command: string;
  textLabel: string;
  Icon: IconType;
  disabled?: boolean;
}

const GenericButton = ({
  command,
  textLabel,
  Icon,
  disabled,
}: GenericButtonProps) => {
  const { processCommand } = useContext(GameDispatchContext);
  const handleClick = useCallback(
    () => processCommand(command),
    [command, processCommand]
  );
  return (
    <Button variant="primary" onClick={handleClick} disabled={disabled}>
      {Icon && <Icon />} {textLabel}
    </Button>
  );
};

export const PlaceRobotButton = ({
  x,
  y,
  facing,
}: {
  x?: number;
  y?: number;
  facing?: string;
}) => {
  const { checkPlacement } = useContext(GameDispatchContext);
  const isDisabled = !checkPlacement(x, y, facing);
  return (
    <GenericButton
      command={`PLACE_ROBOT ${x},${y},${facing}`}
      disabled={isDisabled}
      Icon={GrRobot}
      textLabel="Place Robot"
    />
  );
};

export const PlaceWallButton = ({
  x,
  y,
}: {
  x?: number;
  y?: number;
}) => {
  const { checkPlacement } = useContext(GameDispatchContext);
  const isDisabled = !checkPlacement(x, y);
  return (
    <GenericButton
      command={`PLACE_WALL ${x},${y}`}
      disabled={isDisabled}
      Icon={GrRobot}
      textLabel="Place Robot"
    />
  );
};

export const MoveRobotButton = () => {
  return (
    <GenericButton
      command={`MOVE`}
      Icon={GrRun}
      textLabel="Move Robot"
    />
  );
};

export const TurnLeftButton = () => {
  return (
    <GenericButton
      command={`LEFT`}
      Icon={GrRotateLeft}
      textLabel="Turn Left"
    />
  );
};

export const TurnRightButton = () => {
  return (
    <GenericButton
      command={`RIGHT`}
      Icon={GrRotateRight}
      textLabel="Turn Right"
    />
  );
};

export const ReportButton = () => {
  return (
    <GenericButton
      command={`RIGHT`}
      Icon={GrAnnounce}
      textLabel="Report"
    />
  );
};