import { useCallback, useContext, useMemo } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { GameDispatchContext } from "../../GameContext/GameProvider";
import {
  MdPlace,
  MdAnnouncement,
  MdOutlineDirectionsRun,
  MdRotateLeft,
  MdRotateRight,
} from "react-icons/md";
import type { IconType } from "react-icons";

interface GenericButtonProps {
  command: string;
  textLabel: string;
  Icon: IconType;
  disabled?: boolean;
}

export const PlaceRobotButton = (props: any) => {
  const { textLabel, ...restProps } = props;
  return (
    <Button {...restProps}>
      <MdPlace /> {textLabel}
    </Button>
  );
};

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
    <Button
      colorScheme="blue"
      size="md"
      onClick={handleClick}
      disabled={disabled}
    >
      {Icon && <Icon />} {textLabel}
    </Button>
  );
};

export const MoveRobotButton = () => {
  return (
    <GenericButton
      command={`MOVE`}
      Icon={MdOutlineDirectionsRun}
      textLabel="Move Robot"
    />
  );
};

export const TurnLeftButton = () => {
  return (
    <GenericButton command={`LEFT`} Icon={MdRotateLeft} textLabel="Turn Left" />
  );
};

export const TurnRightButton = () => {
  return (
    <GenericButton
      command={`RIGHT`}
      Icon={MdRotateRight}
      textLabel="Turn Right"
    />
  );
};

export const ReportButton = () => {
  return (
    <GenericButton
      command={`REPORT`}
      Icon={MdAnnouncement}
      textLabel="Report"
    />
  );
};
